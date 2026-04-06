namespace ChatApp.Dtos;

public record FriendInfoDTO(string UserId, string ExibitedUsername, string UserProfilePicUrl, string PrivateChannelId) : UserDTO(UserId, ExibitedUsername, UserProfilePicUrl);