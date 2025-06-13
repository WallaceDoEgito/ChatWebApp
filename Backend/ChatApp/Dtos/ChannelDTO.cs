namespace ChatApp.Dtos;

public record ChannelDTO(string ChannelId, string ChannelName, UserDTO[] Users);