using ChatApp.Data;

namespace ChatApp.Workers;

public class MessageDemux(RabbitMQConnection rabbitMqConnection) : BackgroundService
{
    
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        throw new NotImplementedException();
    }
}