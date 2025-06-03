using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs;

[Authorize]
public class PrincipalHub(RabbitMQConnection connection, IFriendService friendService, RedisService redis) : Hub
{
    public async Task SendMessage(MessageRequest request)
    {
        if (Context.UserIdentifier != request.UserId) return;
        await connection.PublishMessage(request);
    }

    public async Task FriendRequest(String userUsernameToReq)
    {
        var newRequest = new FriendRequestDTO(Context.UserIdentifier, userUsernameToReq);
        try
        {
            await friendService.CreateRequest(newRequest);
        }
        catch (Exception e)
        {
            return;
        }
    }
    
    public async Task FriendResponse(String userResponded, bool accepted)
    {
        var newRequest = new FriendResponseDTO(Context.UserIdentifier,userResponded,accepted);
        try
        {
            await friendService.ResponseRequest(newRequest);
        }
        catch (Exception e)
        {
            return;
        }
    }

    public override async Task OnConnectedAsync()
    {
        await redis.UserConnectedAsync(Context.UserIdentifier, Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await redis.UserDisconnectedAsync(Context.UserIdentifier, Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}