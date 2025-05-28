using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using ChatApp.Interfaces;
using ChatApp.Services;

namespace ChatApp.Models;

public class User
{
    public Guid Id { get; set; }
    [MaxLength(32)] public required string UserName { get; set; } = String.Empty;
    public required string PasswordHashed { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }= DateTime.Now;
    public ICollection<Channel> Channels { get; set; } = new List<Channel>();
    public ICollection<User> Friends { get; set; } = new List<User>();
    public ICollection<User> FriendOf { get; set; } = new List<User>();

    public ICollection<Message> SendMessages { get; set; } = new List<Message>();
    private readonly IHasher _passwordHasher = new BcryptPasswordHasher();

    public User(){}
    

    [SetsRequiredMembers]
    public User(string username, string password)
    {
        Id = Guid.NewGuid();
        UserName = username;
        PasswordHashed = _passwordHasher.HashPassword(password);
        CreatedAt = DateTime.Now;
    }
}