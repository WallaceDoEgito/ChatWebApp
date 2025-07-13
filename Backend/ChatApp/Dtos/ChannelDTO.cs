namespace ChatApp.Dtos;

public record ChannelDTO(string ChannelId, string ChannelName, DateOnly CreationDate, UserDTO[] Users, bool PrivateChannel, string ChannelProfilePic );