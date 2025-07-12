namespace ChatApp.Dtos;

public record MessageEditedEventDto(string ChannelId, string MessageId, string NewMessage);