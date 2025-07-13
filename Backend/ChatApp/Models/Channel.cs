using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models;

public class Channel
{
    [MaxLength(64)] public String ChannelName { get; set; }
    public Guid ChannelId { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<User> Participants { get; set; } = new List<User>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public bool PrivateChannel { get; set; }
    public string ChannelProfilePicUrl { get; set; } = String.Empty;

public Channel(String channelName)
    {
        ChannelName = channelName;
        ChannelId = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        PrivateChannel = true;
    }

    public Channel(String channelName, bool privateChannel)
    {
        ChannelName = channelName;
        ChannelId = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        PrivateChannel = privateChannel;
    }
}