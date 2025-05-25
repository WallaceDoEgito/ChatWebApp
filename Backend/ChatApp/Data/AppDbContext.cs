using ChatApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Data;

public class AppDbContext(IConfiguration configuration) : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Message> Message { get; set; }
    public DbSet<Channel> Channels { get; set; }

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
        base.OnModelCreating(modelBuilder);
    }
}