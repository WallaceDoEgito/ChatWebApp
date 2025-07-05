namespace ChatApp.Dtos;

public record MessageToDemuxDTO(string MessageId, string UserIdThatSended, string ChannelId, string MessageContent, DateTime SendAt, bool Edited);