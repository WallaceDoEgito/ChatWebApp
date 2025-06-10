using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Hubs;
using ChatApp.Interfaces;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services;

public class FriendService(AppDbContext dbContext, RedisService redis, IHubContext<PrincipalHub> hub) : IFriendService
{
    public async Task CreateRequest(FriendRequestDTO requestDto)
    {
       var userToReq = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == requestDto.UserIdToRequest);
       if (userToReq is null) throw new ArgumentException("Esse usuario nao existe");
       bool reqExists =
           await dbContext.FriendRequests.AnyAsync(fr =>
               fr.UserId.ToString() == requestDto.UserId && fr.UserToRequestId == userToReq.Id);
       
       if (reqExists) return;
       bool otherUserHasAlreadyRequested = await dbContext.FriendRequests.AnyAsync(fr =>
               fr.UserId == userToReq.Id && fr.UserToRequestId.ToString() == requestDto.UserId);

       if (otherUserHasAlreadyRequested)
       {
           await ResponseRequest(new FriendResponseDTO(requestDto.UserId,userToReq.Id.ToString(), true));
           return;
       }

       var userWhoRequested = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == requestDto.UserId);
       if(userWhoRequested is null) throw new ArgumentException("Por algum motivo o requisitor nao existe nesse momento");
       
       FriendRequest newReq = new FriendRequest(userWhoRequested.Id, userToReq.Id);
       userWhoRequested.SendFriendRequests.Add(newReq);
       userToReq.ReceviedFriendRequests.Add(newReq);
       await dbContext.SaveChangesAsync();

       await NotifyNewFriendRequestIfOnline(userToReq.Id.ToString(), userWhoRequested.UserName);
    }

    public async Task ResponseRequest(FriendResponseDTO response)
    {
        var userRequested = await dbContext.Users.Include(u => u.ReceviedFriendRequests).FirstOrDefaultAsync(u => u.Id.ToString() == response.UserRequestedId);
        if (userRequested is null) throw new Exception("O usuario requisitado nao existe");

        var request = userRequested.ReceviedFriendRequests.FirstOrDefault(u => u.UserToRequestId == userRequested.Id);
        if (request is null) throw new Exception("Por algum motivo oculto, a requisicao nao existe");
        if (response.Accepted == true)
        {
            var userToBeFriend = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);
            if (userToBeFriend is null) throw new Exception("O usuario que cria ser amigo nao existe");
            userToBeFriend.Friends.Add(userRequested);
            userToBeFriend.FriendOf.Add(userRequested);
            userRequested.Friends.Add(userToBeFriend);
            userRequested.FriendOf.Add(userToBeFriend);
            await NotifyAcceptedIfOnline(userRequested.Id.ToString(), userToBeFriend.UserName);
            await NotifyAcceptedIfOnline(userToBeFriend.Id.ToString(), userRequested.UserName);
        }
        userRequested.ReceviedFriendRequests.Remove(request);
        await dbContext.SaveChangesAsync();
    }

    private async Task NotifyNewFriendRequestIfOnline(String userToNotifyId, String requestFriendName)
    {
        var userOnline = await redis.CheckUserOnline(userToNotifyId);
        if (userOnline)
        {
            var connectionString = await redis.GetUserConnections(userToNotifyId);
            await hub.Clients.Clients(connectionString).SendAsync("NewFriendRequest", requestFriendName);
        }
    }

    private async Task NotifyAcceptedIfOnline(String userToNofifyId, String newFriendName)
    {
        var userOnline = await redis.CheckUserOnline(userToNofifyId);
        if (userOnline)
        {
            var connectionString = await redis.GetUserConnections(userToNofifyId);
            await hub.Clients.Clients(connectionString).SendAsync("NewFriendAccepted", newFriendName);
        }
    }
}