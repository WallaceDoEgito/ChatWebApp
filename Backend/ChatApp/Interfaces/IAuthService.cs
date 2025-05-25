using ChatApp.Dtos;

namespace ChatApp.Interfaces;

public interface IAuthService
{
    public String? RegisterUser(RegisterUserRequest req);
    public String? Login(LoginUserRequest req);
}