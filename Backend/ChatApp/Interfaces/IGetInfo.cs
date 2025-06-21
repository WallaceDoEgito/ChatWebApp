using ChatApp.Dtos;
using ChatApp.Models;

namespace ChatApp.Interfaces;

public interface IGetInfo
{
    public Task<ChannelDTO[]> GetUserChannels(String userId);
    public Task<MessageDTO[]> GetMessageByChannel(String channelId, int page);
    public Task<UserDTO[]> GetFriendRequests(String userId);

    public Task<UserDTO[]> GetFriends(string userId);
}