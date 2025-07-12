using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Exceptions;
using ChatApp.Interfaces;
using ChatApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services;

public class GetInfoService(AppDbContext dbContext) : IGetInfo
{
    public async Task<ChannelDTO[]> GetUserChannels(string userId)
    {
        var user = await dbContext.Users.Include(u => u.Channels).ThenInclude(c=> c.Participants)
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        
        if (user is null) return [];
        
        return user.Channels.Select(c => new ChannelDTO(c.ChannelId.ToString(), c.ChannelName, DateOnly.FromDateTime(c.CreatedAt) , 
            c.Participants.Select(p => new UserDTO(p.Id.ToString(), p.ExhibitedName, p.ProfilePicUrl)).ToArray())).ToArray();

    }

    public async Task<MessageDTO[]> GetMessageByChannel(string channelId, int page)
    {
        int pageTam = 20;
        var message = await dbContext.Message.Where(m => m.ChannelId.ToString() == channelId)
            .OrderByDescending(m => m.SentAt).Skip((page - 1) * pageTam).Take(pageTam).Select(m =>
                new MessageDTO(m.UserIdSender.ToString()!, m.Sender.ExhibitedName, m.MessageContent, m.MessageId.ToString(), m.SentAt, m.Edited)).ToArrayAsync();
        return message;
    }

    public async Task<UserDTO[]> GetFriendRequests(string userId)
    {
        var userReq = await dbContext.Users.Include(u => u.ReceviedFriendRequests).ThenInclude(req => req.User)
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (userReq is null) return [];
        return userReq.ReceviedFriendRequests.Select(req => new UserDTO(req.UserId.ToString(), req.User.ExhibitedName, req.User.ProfilePicUrl)).ToArray();
    }

    public async Task<UserDTO[]> GetFriends(string userId)
    {
        var user = await dbContext.Users.Include(u => u.Friends).FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user is null) throw new ThisUserDontExistEx();
        UserDTO[] friends = user.Friends.Select(u => new UserDTO(u.Id.ToString(), u.ExhibitedName, u.ProfilePicUrl)).ToArray();
        return friends;
    }

    public async Task<UserDTO> GetUserInfo(string userId)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user is null) throw new ThisUserDontExistEx();
        return new UserDTO(userId, user.ExhibitedName, user.ProfilePicUrl);
    }
}