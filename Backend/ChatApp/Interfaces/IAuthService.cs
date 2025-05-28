using ChatApp.Dtos;

namespace ChatApp.Interfaces;

public interface IAuthService
{
    public Task<String?> RegisterUser(RegisterUserRequest req);
    public Task<String?> Login(LoginUserRequest req);
}