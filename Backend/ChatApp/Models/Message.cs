using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace ChatApp.Models;

public class Message
{
    public Guid MessageId { get; set; }
    public required Guid UserIdSender { get; set; }
    public User Sender { get; set; } = null!;

    public required DateTime SentAt { get; set; }
    public required bool Edited { get; set; }
    public required bool Seen { get; set; }
    public required bool Deleted { get; set; }
    
    
    [MaxLength(800)]public required string MessageContent { get; set; }
    
    public required Guid ChannelId { get; set; }
    public Channel Channel { get; set; } = null!;

    public Message()
    {
        
    }
    
    
    [SetsRequiredMembers]
    public Message(Guid sender, String message, Guid recieverId)
    {
        SentAt = DateTime.UtcNow;
        MessageId = Guid.NewGuid();
        UserIdSender = sender;
        MessageContent = message;
        ChannelId = recieverId;
        Edited = false;
        Seen = false;
        Deleted = false;
    }
}