using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Interfaces;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs;

[Authorize]
public class PrincipalHub(RabbitMQConnection connection, IFriendService friendService, RedisService redis, IGetInfo getInfoService) : Hub
{
    public async Task SendMessage(MessageRequest request)
    {
        if (Context.UserIdentifier != request.UserId) return;
        await connection.PublishMessage(request);
    }

    public async Task<bool> FriendRequest(String usernameToReq)
    {
        var newRequest = new FriendRequestDTO(Context.UserIdentifier!, usernameToReq);
        try
        {
            await friendService.CreateRequest(newRequest);
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }
    
    public async Task FriendResponse(String userRespondedId, bool accepted)
    {
        var newRequest = new FriendResponseDTO(Context.UserIdentifier!,userRespondedId,accepted);
        try
        {
            await friendService.ResponseRequest(newRequest);
        }
        catch (Exception e)
        {
            return;
        }
    }

    public async Task<ChannelDTO[]> GetChannelList()
    {
        return await getInfoService.GetUserChannels(Context.UserIdentifier!);
    }
    public async Task<UserDTO[]> GetFriendRequests()
    {
        UserDTO[] requestsList = await getInfoService.GetFriendRequests(Context.UserIdentifier!);
        return requestsList;
    }
    public async Task<MessageDTO[]> GetMessageByChannelAndPage(string channelId, int page)
    {
        MessageDTO[] messageList = await getInfoService.GetMessageByChannel(channelId, page);
        return messageList;
    }
    
    

    public override async Task OnConnectedAsync()
    {
        await redis.UserConnectedAsync(Context.UserIdentifier!, Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await redis.UserDisconnectedAsync(Context.UserIdentifier!, Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}