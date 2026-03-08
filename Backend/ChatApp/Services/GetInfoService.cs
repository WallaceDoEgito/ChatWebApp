using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Exceptions;
using ChatApp.Hubs;
using ChatApp.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services;

public class GetInfoService(AppDbContext dbContext, IHubContext<PrincipalHub> hubContext, RedisService redisService) : IGetInfo
{
    public async Task<ChannelDTO[]> GetUserChannels(string userId)
    {
        var user = await dbContext.Users.Include(u => u.Channels).ThenInclude(c => c.Participants)
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

        if (user is null) return [];

        return user.Channels.Select(c => new ChannelDTO(c.ChannelId.ToString(),
            c.PrivateChannel ? c.Participants.First(p => p.Id.ToString() != userId).ExhibitedName : c.ChannelName,
            DateOnly.FromDateTime(c.CreatedAt),
            c.Participants.Select(p => new UserDTO(p.Id.ToString(), p.ExhibitedName, p.ProfilePicUrl)).ToArray(),
            c.PrivateChannel,
            c.PrivateChannel
                ? c.Participants.First(p => p.Id.ToString() != userId).ProfilePicUrl
                : c.ChannelProfilePicUrl)).ToArray();
    }

    public async Task<MessageDTO[]> GetMessageByChannel(string channelId, int page)
    {
        int pageTam = 20;
        var message = await dbContext.Message.Include(m => m.Sender).Where(m => m.ChannelId.ToString() == channelId)
            .OrderByDescending(m => m.SentAt).Skip((page - 1) * pageTam).Take(pageTam).Select(m =>
                new MessageDTO(new UserDTO(m.Sender.Id.ToString(), m.Sender.ExhibitedName, m.Sender.ProfilePicUrl)
                    , m.MessageContent, m.MessageId.ToString(), channelId, m.SentAt, m.Edited)).ToArrayAsync();
        return message;
    }

    public async Task<UserDTO[]> GetFriendRequests(string userId)
    {
        var userReq = await dbContext.Users.Include(u => u.ReceviedFriendRequests).ThenInclude(req => req.User)
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (userReq is null) return [];
        return userReq.ReceviedFriendRequests
            .Select(req => new UserDTO(req.UserId.ToString(), req.User.ExhibitedName, req.User.ProfilePicUrl))
            .ToArray();
    }

    public async Task<UserDTO[]> GetFriends(string userId)
    {
        var user = await dbContext.Users.Include(u => u.Friends).FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user is null) throw new ThisUserDontExistEx();
        UserDTO[] friends = user.Friends.Select(u => new UserDTO(u.Id.ToString(), u.ExhibitedName, u.ProfilePicUrl))
            .ToArray();
        return friends;
    }

    public async Task<UserDTO> GetUserInfo(string userId)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user is null) throw new ThisUserDontExistEx();
        return new UserDTO(userId, user.ExhibitedName, user.ProfilePicUrl);
    }

    public async Task<UserConfigDTO> GetUserConfigInfo(string userId)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user is null) throw new ThisUserDontExistEx();
        return new UserConfigDTO(user.UserName, user.ExhibitedName, user.ProfilePicUrl);
    }

    public async Task<UserDTO> UpdateUserConfigInfo(string userId, UserConfigDTO newUserInfo)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user is null) throw new ThisUserDontExistEx();

        var nameAlreadyInUse =
            await dbContext.Users.AnyAsync(u => u.UserName == newUserInfo.Username && u.Id.ToString() != userId);
        if (nameAlreadyInUse) throw new UsernameAlreadyTaken();

        user.ExhibitedName = newUserInfo.ExibitedUsername;
        user.UserName = newUserInfo.Username;
        user.ProfilePicUrl = newUserInfo.UserProfilePicUrl;

        await dbContext.SaveChangesAsync();

        var userDto = new UserDTO(userId, user.ExhibitedName, user.ProfilePicUrl);
        List<string> friendsIds = await GetFriendIdsListByUserId(userId);

        foreach (var id in friendsIds)
        {
            var connectionStrings = await redisService.GetUserConnections(id);
            await hubContext.Clients.Clients(connectionStrings).SendAsync("FriendProfileChange", userDto);
        }

        return userDto;
    }

    private Task<List<string>> GetFriendIdsListByUserId(string userId)
    {
        var friendsIdList = dbContext.Users.Include(u => u.Friends)
            .Where(u => u.Id.ToString() == userId)
            .SelectMany(u => u.Friends)
            .Select(f => f.Id.ToString())
            .ToListAsync();

        return friendsIdList;
    }
}