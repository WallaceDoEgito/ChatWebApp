using System.Text;
using System.Text.Json;
using ChatApp.Dtos;
using ChatApp.Models;
using RabbitMQ.Client;

namespace ChatApp.Data;

public class RabbitMQConnection
{
    private IConfiguration _enviroment;
    public RabbitMQConnection(IConfiguration enviroment)
    {
        _enviroment = enviroment;
        _ = Config();
    }

    private async Task Config()
    {
        var factory = new ConnectionFactory {HostName = _enviroment.GetValue<string>("RabbitMqHost") ?? "localhost"};
        await using IConnection connection =  await factory.CreateConnectionAsync();
        
        await using IChannel channelMessageCreator = await connection.CreateChannelAsync();
        await channelMessageCreator.QueueDeclareAsync(queue:"MessageRequestQueue", durable:true,exclusive:false, autoDelete:false);
        await channelMessageCreator.ExchangeDeclareAsync(exchange: "MessageRequestsExchange", type: ExchangeType.Fanout);
        await channelMessageCreator.BasicQosAsync(prefetchSize: 0, prefetchCount: 1, global: false);
        await channelMessageCreator.QueueBindAsync(queue: "MessageRequestQueue", exchange: "MessageRequestsExchange",
            routingKey: String.Empty);

        await using IChannel channelMessageTransmission = await connection.CreateChannelAsync();
        await channelMessageTransmission.QueueDeclareAsync(queue:"Message_DLQ_Queue", durable:true, exclusive:false, autoDelete:false);
        await channelMessageTransmission.ExchangeDeclareAsync(exchange: "Message_DLQ_Exchange", ExchangeType.Direct);

        await channelMessageTransmission.ExchangeDeclareAsync(exchange: "Message_Distribution_Exchange",
            ExchangeType.Fanout);
        
        await channelMessageTransmission.QueueDeclareAsync(queue: "MessageDistribution", durable: true, exclusive: false,
            autoDelete: false, arguments: new Dictionary<string, object?>
            {
                { "x-dead-letter-exchange", "Message_DLQ_Exchange" },
                {"x-dead-letter-routing-key", "Message_DLQ_Queue" }
            });
        await channelMessageTransmission.QueueBindAsync(queue: "MessageDistribution",
            exchange: "Message_Distribution_Exchange", String.Empty);
        
        
        await channelMessageTransmission.QueueDeclareAsync(queue: "Message_Demux_Queue", durable: true,
            exclusive: false, autoDelete: false);
        await channelMessageTransmission.ExchangeDeclareAsync(exchange: "Message_Demux_Exchange", ExchangeType.Fanout);
        await channelMessageTransmission.QueueBindAsync(queue: "Message_Demux_Queue",
            exchange: "Message_Demux_Exchange", String.Empty);
    }

    public async Task PublishMessage(MessageRequest req)
    {
        var factory = new ConnectionFactory {HostName = _enviroment.GetValue<string>("RabbitMqHost") ?? "localhost"};
        await using IConnection connection = await factory.CreateConnectionAsync();
        var jsonMessageParse = JsonSerializer.Serialize(req);
        var bodyEncoded = Encoding.UTF8.GetBytes(jsonMessageParse);
        await using IChannel publish = await connection.CreateChannelAsync();

        await publish.BasicPublishAsync(exchange: "MessageRequestsExchange", body: bodyEncoded,
            routingKey: "MessageRequestQueue");
    }

    public async Task DemuxMessage(MessageToDemuxDTO message)
    {
        var factory = new ConnectionFactory {HostName = _enviroment.GetValue<string>("RabbitMqHost") ?? "localhost"};
        await using IConnection connection = await factory.CreateConnectionAsync();
        var jsonMessageParse = JsonSerializer.Serialize(message);
        var bodyEncoded = Encoding.UTF8.GetBytes(jsonMessageParse);
        await using IChannel publish = await connection.CreateChannelAsync();
        await publish.BasicPublishAsync(exchange: "Message_Demux_Exchange", body: bodyEncoded,
            routingKey: String.Empty);
    }
    public async Task TransmitMessage(MessageDemuxDto message)
    {
        var factory = new ConnectionFactory {HostName = _enviroment.GetValue<string>("RabbitMqHost") ?? "localhost"};
        await using IConnection connection = await factory.CreateConnectionAsync();
        var jsonMessageParse = JsonSerializer.Serialize(message);
        var bodyEncoded = Encoding.UTF8.GetBytes(jsonMessageParse);
        await using IChannel publish = await connection.CreateChannelAsync();
        await publish.BasicPublishAsync(exchange: "Message_Distribution_Exchange", body: bodyEncoded,
            routingKey: String.Empty);
    }
}