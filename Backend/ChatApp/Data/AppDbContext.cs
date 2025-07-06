using ChatApp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop.Implementation;

namespace ChatApp.Data;

public class AppDbContext(IConfiguration configuration) : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Message> Message { get; set; }
    public DbSet<Channel> Channels { get; set; }
    public DbSet<FriendRequest> FriendRequests { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(configuration.GetSection("ConnectionString").Value);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<User>((entity) =>
        {
            entity.HasIndex(u => u.Id).IsUnique();
            entity.HasKey(u => u.Id);
            entity.HasMany(u => u.SendMessages).WithOne(m => m.Sender).HasForeignKey(m => m.UserIdSender)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasMany(u => u.Friends).WithMany(u => u.FriendOf).UsingEntity<Dictionary<string, object>>(
                "UserFriends",
                j => j.HasOne<User>().WithMany().HasForeignKey("UserReqId"),
                j => j.HasOne<User>().WithMany().HasForeignKey("FriendId"),
                j => j.HasKey("UserReqId", "FriendId"));
            
            entity.HasMany(u => u.Channels).WithMany(c => c.Participants).UsingEntity<Dictionary<string, object>>
                ("ChannelParticipants",
                    j=> j.HasOne<Channel>().WithMany().HasForeignKey("ChannelId"),
                    j => j.HasOne<User>().WithMany().HasForeignKey("UserId"),
                    j => j.HasKey("UserId", "ChannelId")
                );
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasIndex(m => new {
                m.SentAt, m.ChannelId
            }).IsDescending(true, false);
            entity.HasKey(e => e.MessageId);
            entity.HasOne(m => m.Sender).WithMany(u => u.SendMessages).OnDelete(DeleteBehavior.NoAction).HasForeignKey(m => m.UserIdSender);
            entity.HasOne(c => c.Channel).WithMany(c => c.Messages).OnDelete(DeleteBehavior.Cascade).HasForeignKey(m => m.ChannelId);
        });

        modelBuilder.Entity<Channel>(entity =>
        {
            entity.HasIndex(c => c.ChannelId).IsUnique();
            entity.HasKey(c => c.ChannelId);
            entity.HasMany(c => c.Participants).WithMany(u => u.Channels);
            entity.HasMany(c => c.Messages).WithOne(m => m.Channel);
        });

        modelBuilder.Entity<FriendRequest>(entity =>
        {
            entity.HasIndex(fr => fr.UserToRequestId);
            entity.HasKey(fr => new { fr.UserId, fr.UserToRequestId });
            entity.HasOne(req => req.User).WithMany(u => u.SendFriendRequests).HasForeignKey(req => req.UserId);
            entity.HasOne(req => req.UserToRequest).WithMany(u => u.ReceviedFriendRequests)
                .HasForeignKey(req => req.UserToRequestId);
        });
        
        base.OnModelCreating(modelBuilder);
    }
}