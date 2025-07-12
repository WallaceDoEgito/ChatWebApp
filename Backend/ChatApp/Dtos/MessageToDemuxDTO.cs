namespace ChatApp.Dtos;

public record MessageToDemuxDTO(string MessageId, string UserIdThatSended, string UserName , string ChannelId, string MessageContent, DateTime SendAt, bool Edited);