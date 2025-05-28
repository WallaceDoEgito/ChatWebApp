using ChatApp.Models;

namespace ChatApp.Interfaces;

public interface ITokenService
{
    public String GenerateToken(User tokenUser);
}