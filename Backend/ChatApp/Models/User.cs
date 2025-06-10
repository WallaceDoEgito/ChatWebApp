using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using ChatApp.Interfaces;
using ChatApp.Services;

namespace ChatApp.Models;

public class User
{
    public Guid Id { get; set; }
    [MaxLength(32)] public required string UserName { get; set; } = String.Empty;
    [MaxLength(32)] public string ExhibitedName { get; set; }
    public required string PasswordHashed { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }= DateTime.UtcNow;
    public ICollection<Channel> Channels { get; set; } = new List<Channel>();
    public ICollection<User> Friends { get; set; } = new List<User>();
    public ICollection<User> FriendOf { get; set; } = new List<User>();

    public ICollection<FriendRequest> SendFriendRequests { get; set; } = new List<FriendRequest>();
    public ICollection<FriendRequest> ReceviedFriendRequests { get; set;} = new List<FriendRequest>();
    

    public ICollection<Message> SendMessages { get; set; } = new List<Message>();
    private readonly IHasher _passwordHasher = new BcryptPasswordHasher();

    public User(){}
    

    [SetsRequiredMembers]
    public User(string username, string password)
    {
        Id = Guid.NewGuid();
        UserName = username;
        ExhibitedName = username;
        PasswordHashed = _passwordHasher.HashPassword(password);
        
    }
}