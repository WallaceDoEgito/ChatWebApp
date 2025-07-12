namespace ChatApp.Interfaces;

public interface IMessageService
{
    public Task DeleteMessage(string userIdRequest, string messageId);
    public Task EditMessage(string userIdRequest, string messageId, string newMessageContent);
}