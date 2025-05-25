using ChatApp.Interfaces;
using ChatApp.Services;

namespace ChatApp.Models;

public class User
{
    public Guid Id { get; set; }
    public required string UserName { get; set; }
    public required string PasswordHashed { get; set; }
    public DateTime CreatedAt = DateTime.Now;
    public ICollection<Channel> Channels { get; set; } = new List<Channel>();
    public ICollection<User> Friends { get; set; } = new List<User>();
    public ICollection<User> FriendOf { get; set; } = new List<User>();

public ICollection<Message> SendMessages { get; set; } = new List<Message>();
    private readonly IHasher _passwordHasher = new BcryptPasswordHasher();

    public User(){}

    public User(string username, string password)
    {
        Id = Guid.NewGuid();
        UserName = username;
        PasswordHashed = _passwordHasher.HashPassword(password);
    }
}