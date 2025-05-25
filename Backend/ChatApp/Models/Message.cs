namespace ChatApp.Models;

public class Message
{
    public Guid MessageId { get; set; }
    public required Guid UserIdSender { get; set; }
    public User Sender { get; set; } = null!;

    public required DateTime SentAt = DateTime.Now;
    public required bool Edited = false;
    public required bool Seen = false;
    public required bool Deleted = false;
    public required string MessageContent { get; set; }
    
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