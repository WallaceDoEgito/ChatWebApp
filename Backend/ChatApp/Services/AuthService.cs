using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Interfaces;
using ChatApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services;

public class AuthService(AppDbContext db, IHasher hasher, ITokenService tokenService) : IAuthService
{
    public async Task<string?> RegisterUser(RegisterUserRequest req)
    {
        User? test = await db.Users.FirstOrDefaultAsync(x => x.UserName == req.UserName);
        if (test != null) return null;
        User newUser = new User(req.UserName, req.Password);
        await db.Users.AddAsync(newUser);
        await db.SaveChangesAsync();
        return newUser.Id.ToString();
    }

    public async Task<string?> Login(LoginUserRequest req)
    {
        User? find = await db.Users.FirstOrDefaultAsync(x => req.UserName == x.UserName);
        if (find is null) return null;
        if (!hasher.VerifyHash(find.PasswordHashed, req.Password)) return null;
        return tokenService.GenerateToken(find);
    }
}