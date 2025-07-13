namespace ChatApp.Dtos;

public record MessageDemuxDto( String MessageId, UserDTO SenderInfo , String ChannelId, String DestinyId, String Message, DateTime SendAt, bool Edited);