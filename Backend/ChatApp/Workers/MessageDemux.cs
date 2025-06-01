using System.Text.Json;
using System.Text.Json.Serialization;
using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Models;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ChatApp.Workers;

public class MessageDemux(RabbitMQConnection rabbitMqConnection, IServiceScopeFactory dbFactory) : BackgroundService
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
        await _channel!.QueueDeclareAsync(queue: "Message_Demux_Queue", durable: true,
            exclusive: false, autoDelete: false);
        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async(sender, ea) =>
        {
            try
            {
                var message = JsonSerializer.Deserialize<Message>(ea.Body.ToArray());
                if (message is null) throw new InvalidDataException();
                await DemuxAndSendToQueue(message);
                await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
            }
            catch
            {
                await _channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue:false);
            }
        };
        await _channel.BasicConsumeAsync(queue: "Message_Demux_Queue", autoAck: false, consumer);
    }

    private async Task DemuxAndSendToQueue(Message mes)
    {
        using (var factory = dbFactory.CreateScope())
        {
            var dbContext = factory.ServiceProvider.GetRequiredService<AppDbContext>();
            var channel = await dbContext.Channels.Include(x => x.Participants).FirstOrDefaultAsync(x => x.ChannelId == mes.ChannelId);
            if (channel is null) throw new KeyNotFoundException();
            foreach (var users in channel.Participants)
            {
                if(users.Id.ToString() == mes.UserIdSender.ToString()) continue;
                MessageDemuxDto dto = new MessageDemuxDto(mes.MessageId.ToString(), mes.UserIdSender.ToString(), mes.ChannelId.ToString(), users.Id.ToString(), mes.MessageContent, mes.SentAt);
                rabbitMqConnection.TransmitMessage(dto);
            }
        }
    }
    
    public override void Dispose()
    {
        _channel.CloseAsync();
        _channel.Dispose();
        base.Dispose();
    }
}