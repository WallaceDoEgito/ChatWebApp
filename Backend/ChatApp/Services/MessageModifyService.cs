using ChatApp.Data;
using ChatApp.Interfaces;
using ChatApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services;

public class MessageModifyService(AppDbContext dbContext) : IMessageService
{
    public async Task DeleteMessage(string userIdRequest, string messageId)
    {
        var message = await dbContext.Message.Include(m => m.Sender).FirstOrDefaultAsync(m => m.MessageId.ToString() == messageId);
        if (message is null) return;
        if (!UserCanModify(message.Sender, message)) return;

        dbContext.Message.Remove(message);
        await dbContext.SaveChangesAsync();
    }

    public async Task EditMessage(string userIdRequest, string messageId, string newMessageContent)
    {
        var message = await dbContext.Message.Include(m => m.Sender).FirstOrDefaultAsync(m => m.MessageId.ToString() == messageId);
        if (message is null) return;
        if (!UserCanModify(message.Sender, message)) return;

        message.MessageContent = newMessageContent;
        message.Edited = true;
        await dbContext.SaveChangesAsync();
    }

    private bool UserCanModify(User user, Message message)
    {
        if (user.Id == message.MessageId) return true;
        return false;
    }
}