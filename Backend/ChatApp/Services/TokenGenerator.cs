using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ChatApp.Interfaces;
using ChatApp.Models;
using Microsoft.IdentityModel.Tokens;

namespace ChatApp.Services;

public class TokenGenerator(IConfiguration config) : ITokenService
{
    public String GenerateToken(User tokenUser)
    {
        var claims = new List<Claim>()
        {
            new Claim(ClaimTypes.NameIdentifier, tokenUser.Id.ToString()!),
            new Claim(ClaimTypes.Name, tokenUser.UserName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetSection("JWTConfig:SecretKey").Value!));
        var signCred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescription = new JwtSecurityToken(
            issuer: config.GetSection("JWTConfig:Issuer").Value,
            audience: config.GetSection("JWTConfig:Audience").Value,
            claims: claims,
            expires: DateTime.Now.AddMinutes(config.GetValue<double>("JWTConfig:ExpirationInMinutes")),
            signingCredentials: signCred
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescription);
    }
}