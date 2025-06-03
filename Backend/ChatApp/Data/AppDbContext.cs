using ChatApp.Models;
using Microsoft.EntityFrameworkCore;

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
        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().HasMany(m => m.SendMessages).WithOne(u => u.Sender).HasForeignKey(m => m.UserIdSender).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<User>().HasMany(f => f.Friends).WithMany(f => f.FriendOf);
        modelBuilder.Entity<User>().HasMany(c => c.Channels).WithMany(u => u.Participants);

        modelBuilder.Entity<Message>().HasKey(m => m.MessageId);
        modelBuilder.Entity<Message>().HasOne(s => s.Sender).WithMany(u => u.SendMessages)
            .HasForeignKey(u => u.UserIdSender).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Channel>().HasMany(m => m.Messages).WithOne(s => s.Channel);
        modelBuilder.Entity<Channel>().HasMany(u => u.Participants).WithMany(m => m.Channels);

        modelBuilder.Entity<FriendRequest>().HasKey(fr => new {fr.UserId , fr.UserToRequestId});
        modelBuilder.Entity<FriendRequest>().HasOne(rq => rq.User).WithMany(u => u.SendFriendRequests).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<FriendRequest>().HasOne(rq => rq.UserToRequest).WithMany(u => u.ReceviedFriendRequests).HasForeignKey(fk => fk.UserToRequestId).OnDelete(DeleteBehavior.Restrict);
        base.OnModelCreating(modelBuilder);
    }
}