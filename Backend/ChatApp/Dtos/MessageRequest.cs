namespace ChatApp.Dtos;

public record MessageRequest(String UserId,String Message, String ChannelId);