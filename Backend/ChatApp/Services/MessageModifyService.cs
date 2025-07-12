using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Hubs;
using ChatApp.Interfaces;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services;

public class MessageModifyService(AppDbContext dbContext, IHubContext<PrincipalHub> hubContext, RedisService redisService) : IMessageService
{
    public async Task DeleteMessage(string userIdRequest, string messageId)
    {
        var message = await dbContext.Message.Include(m => m.Sender).Include(m => m.Channel).ThenInclude(c => c.Participants).FirstOrDefaultAsync(m => m.MessageId.ToString() == messageId);
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

    private async Task WarnClientsForEditMessage(Channel channel, Message message)
    {
        foreach (User user in channel.Participants)
        {
            if (await redisService.CheckUserOnline(user.Id.ToString()))
            {
                var userConnections = await redisService.GetUserConnections(user.Id.ToString());
                await hubContext.Clients.Clients(userConnections)
                    .SendAsync("MessageEditedInChannel", new MessageEditedEventDto(channel.ChannelId.ToString(), message.MessageId.ToString(), message.MessageContent));
                
            }
        }
    }
    
    private async Task WarnClientsForDeletedMessage(Channel channel, string messageId)
    {
        foreach (User user in channel.Participants)
        {
            if (await redisService.CheckUserOnline(user.Id.ToString()))
            {
                var userConnections = await redisService.GetUserConnections(user.Id.ToString());
                await hubContext.Clients.Clients(userConnections)
                    .SendAsync("MessageDeletedInChannel", new MessageDeletedEventDto(channel.ChannelId.ToString(), messageId));
                
            }
        }
    }
}