using System.Text.Json;
using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Models;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ChatApp.Workers;

public class MessageCreator(IServiceScopeFactory dbContextFactory, RabbitMQConnection rabbitMqConnection) : BackgroundService
{
    private IConnection? _connection;
    private IChannel? _channel;
    
    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        var factory = new ConnectionFactory();
        _connection = await factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();
        await base.StartAsync(cancellationToken);
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _channel.QueueDeclareAsync(queue:"MessageRequestQueue", durable:true,exclusive:false, autoDelete:false);
        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            try
            {
                var body = ea.Body.ToArray();
                var message = JsonSerializer.Deserialize<MessageRequest>(body);
                await ProcessMessage(message!);
                await _channel.BasicAckAsync(ea.DeliveryTag, false);
            }
            catch
            {
                await _channel.BasicNackAsync(ea.DeliveryTag, false, false);
            }
        };
        await _channel.BasicConsumeAsync("MessageRequestQueue", autoAck:false, consumer);
    }

    private async Task ProcessMessage(MessageRequest request)
    {
        using (var factory = dbContextFactory.CreateScope())
        {
            var dbContext = factory.ServiceProvider.GetRequiredService<AppDbContext>();
            User? findUser = await dbContext.Users.Include(x => x.Channels).FirstOrDefaultAsync(x => x.Id.ToString() == request.UserId);
            if (findUser is null) throw new ArgumentException();
            var channel = findUser.Channels.FirstOrDefault(x => x.ChannelId.ToString() == request.ChannelId);
            if (channel is null) throw new ArgumentException();
    
            var message = new Message(findUser.Id, request.Message, channel.ChannelId);
            findUser.SendMessages.Add(message);
            channel.Messages.Add(message);
            await dbContext.SaveChangesAsync();
            
            rabbitMqConnection.DemuxMessage(message);
        }
    }

    public override void Dispose()
    {
        _connection.CloseAsync();
        _connection.Dispose();
        _channel.CloseAsync();
        _channel.Dispose();
        base.Dispose();
    }
}