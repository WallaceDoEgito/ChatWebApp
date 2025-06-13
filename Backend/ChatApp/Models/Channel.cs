using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models;

public class Channel
{
    [MaxLength(64)]
    public String ChannelName { get; set; }
    public Guid ChannelId { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<User> Participants { get; set; } = new List<User>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();

    public Channel(String channelName)
    {
        ChannelName = channelName;
        ChannelId = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
    }
}