namespace ChatApp.Dtos;

public record MessageDemuxDto( String MessageId, String SenderId, String ChannelId, String DestinyId, String Message, DateTime SendAt);