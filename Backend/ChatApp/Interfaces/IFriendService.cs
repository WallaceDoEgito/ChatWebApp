using ChatApp.Dtos;

namespace ChatApp.Interfaces;

public interface IFriendService
{
    public Task CreateRequest(FriendRequestDTO requestDto);
    public Task ResponseRequest(FriendResponseDTO request);
}