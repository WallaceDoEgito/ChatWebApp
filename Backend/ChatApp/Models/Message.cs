using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models;

public class Message
{
    public Guid MessageId { get; set; }
    public required Guid UserIdSender { get; set; }
    public User Sender { get; set; } = null!;

    public required DateTime SentAt { get; set; }= DateTime.UtcNow;
    public required bool Edited { get; set; }= false;
    public required bool Seen { get; set; }= false;
    public required bool Deleted { get; set; }= false;
    
    
    [MaxLength(800)]public required string MessageContent { get; set; }
    
    public required Guid ChannelId { get; set; }
    public Channel Channel { get; set; } = null!;

    public Message()
    {
        
    }

    public Message(Guid sender, String message, Guid recieverId)
    {
        MessageId = Guid.NewGuid();
        UserIdSender = sender;
        MessageContent = message;
        ChannelId = recieverId;
    }
}