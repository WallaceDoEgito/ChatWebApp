namespace ChatApp.Dtos;

public record MessageToDemuxDTO(string MessageId, UserDTO SenderInfo , string ChannelId, string MessageContent, DateTime SendAt, bool Edited);