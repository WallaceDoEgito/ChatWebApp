using ChatApp.Data;
using ChatApp.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs;

[Authorize]
public class PrincipalHub(RabbitMQConnection connection) : Hub
{
    public void SendMessage(MessageRequest request)
    {
        if (Context.UserIdentifier != request.UserId) return;
        connection.PublishMessage(request);
    }
}