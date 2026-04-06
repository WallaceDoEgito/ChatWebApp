using ChatApp.Dtos;
using ChatApp.Models;

namespace ChatApp.Interfaces;

public interface IGetInfo
{
    public Task<ChannelDTO[]> GetUserChannels(String userId);
    public Task<MessageDTO[]> GetMessageByChannel(String channelId, int page);
    public Task<UserDTO[]> GetFriendRequests(String userId);

    public Task<FriendInfoDTO[]> GetFriends(string userId);
    public Task<UserDTO> GetUserInfo(string userId);
    public Task<UserConfigDTO> GetUserConfigInfo(string userId);
    public Task<UserDTO> UpdateUserConfigInfo(string userId, UserConfigDTO newUserInfo);
}