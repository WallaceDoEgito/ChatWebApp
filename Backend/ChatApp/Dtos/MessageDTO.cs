namespace ChatApp.Dtos;

public record MessageDTO(string UserIdThatSended, string UserNameThatSended, string MessageContent, string MessageId, string ChannelId, DateTime SendAt, bool Edited);
