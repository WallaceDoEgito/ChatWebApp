namespace ChatApp.Dtos;

public record MessageDTO(string UserIdThatSended, string UserNameThatSended, string MessageContent, string MessageId, DateTime SendAt, bool Edited);
