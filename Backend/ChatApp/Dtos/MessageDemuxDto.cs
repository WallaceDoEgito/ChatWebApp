namespace ChatApp.Dtos;

public record MessageDemuxDto( String MessageId, String SenderId, string SenderUsername, String ChannelId, String DestinyId, String Message, DateTime SendAt, bool Edited);