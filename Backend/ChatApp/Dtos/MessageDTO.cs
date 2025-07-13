namespace ChatApp.Dtos;

public record MessageDTO(UserDTO UserThatSended, string MessageContent, string MessageId, string ChannelId, DateTime SendAt, bool Edited);
