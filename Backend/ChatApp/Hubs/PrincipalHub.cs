using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Exceptions;
using ChatApp.Interfaces;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs;

[Authorize]
[EnableCors]
public class PrincipalHub(RabbitMQConnection connection, IFriendService friendService, RedisService redis, IGetInfo getInfoService, IMessageService messageService) : Hub
{
    public async Task SendMessage(String messageContent, String channelId)
    {
        MessageRequest request = new MessageRequest(Context.UserIdentifier!, messageContent, channelId);
        await connection.PublishMessage(request);
    }

    public async Task FriendRequest(String usernameToReq)
    {
        var newRequest = new FriendRequestDTO(Context.UserIdentifier!, usernameToReq);
        try
        {
            await friendService.CreateRequest(newRequest);
            await Clients.Caller.SendAsync("SendedFriendServerResponse",
                new { error = false, msg = "Requisicao Enviada com sucesso!" });
        }
        catch (AlreadyIsFriendEx)
        {
            await Clients.Caller.SendAsync("SendedFriendServerResponse",
                new { error = true, msg = "Você ja é amigo deste usuario!" });
        }
        catch (ThisUserDontExistEx)
        {
            await Clients.Caller.SendAsync("SendedFriendServerResponse",
                new { error = true, msg = "Não encontramos nenhum usuario com esse nome" });
        }
        catch (DontAddYourselfEx)
        {
            await Clients.Caller.SendAsync("SendedFriendServerResponse",
                new { error = true, msg = "Não é possivel se adicionar!" });
        }
        
        catch (Exception)
        {
            await Clients.Caller.SendAsync("SendedFriendServerResponse", new {error = true, msg = "Ocorreu um erro ao enviar o pedido, tente mais tarde"}); 
        }
    }
    
    public async Task FriendResponse(String userRespondedId, bool accepted)
    {
        var newRequest = new FriendResponseDTO(Context.UserIdentifier!,userRespondedId,accepted);
        try
        {
            await friendService.ResponseRequest(newRequest);
        }
        catch (Exception)
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
    
    public async Task<UserDTO[]> GetFriends()
    {
        UserDTO[] requestsList = await getInfoService.GetFriends(Context.UserIdentifier!);
        return requestsList;
    }
    public async Task<MessageDTO[]> GetMessageByChannelAndPage(string channelId, int page)
    {
        MessageDTO[] messageList = await getInfoService.GetMessageByChannel(channelId, page);
        return messageList;
    }

    public async Task DeleteMessageById(string messageId)
    {
        await messageService.DeleteMessage(Context.UserIdentifier!, messageId);
    }

    public async Task EditMessageById(string messageId, string newMessageContent)
    {
        await messageService.EditMessage(Context.UserIdentifier!, messageId, newMessageContent);
    }

    public async Task<UserDTO> GetCurrentUserInfo()
    {
        return await getInfoService.GetUserInfo(Context.UserIdentifier!);
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