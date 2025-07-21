using System.Text.Json;
using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Hubs;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ChatApp.Workers;

public class MessageDistribution(IHubContext<PrincipalHub> hubContext, IServiceScopeFactory redisFactory) : BackgroundService
{
    private IConnection? _connection;
    private IChannel? _channel;
    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        var factory = new ConnectionFactory{HostName = "rabbitmq"};
        _connection = await factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();
        await base.StartAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _channel!.QueueDeclareAsync(queue: "MessageDistribution", durable: true, exclusive: false,
            autoDelete: false, arguments: new Dictionary<string, object?>
            {
                { "x-dead-letter-exchange", "Message_DLQ_Exchange" },
                {"x-dead-letter-routing-key", "Message_DLQ_Queue" }
            });
        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            try
            {
                var message = JsonSerializer.Deserialize<MessageDemuxDto>(ea.Body.ToArray());
                if (message is null) throw new ArgumentException();
                bool userIsOnline = await CheckUserHasAActiveConnection(message.DestinyId);
                if (!userIsOnline)
                    await _channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: false);
                else
                {
                    await SendMessage(message);
                    await _channel.BasicAckAsync(ea.DeliveryTag, multiple:false);
                }
            }
            catch
            {
                await _channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: false);
            }
        };
        await _channel.BasicConsumeAsync("MessageDistribution", autoAck:false, consumer);
    }

    private async Task SendMessage(MessageDemuxDto messageDemux)
    {
        using var factory = redisFactory.CreateScope();
        var redisDb = factory.ServiceProvider.GetRequiredService<RedisService>();
        var connections = await redisDb.GetUserConnections(messageDemux.DestinyId);
        var message = new MessageDTO(messageDemux.SenderInfo, messageDemux.Message,
            messageDemux.MessageId, messageDemux.ChannelId ,messageDemux.SendAt, messageDemux.Edited);
        await hubContext.Clients.Clients(connections).SendAsync("NewMessage", message);
        
    }
    private async Task<bool> CheckUserHasAActiveConnection(String userId)
    {
        using (var factory = redisFactory.CreateScope())
        {
            var redisDb = factory.ServiceProvider.GetRequiredService<RedisService>();
            return await redisDb.CheckUserOnline(userId);
        }
    }

    public override async void Dispose()
    {
        await _connection!.CloseAsync();
        await _connection!.DisposeAsync();
        await _channel!.CloseAsync();
        await _channel!.DisposeAsync();
        base.Dispose();
    }
}