using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace ChatApp.Extensions;

public static class JWTConfig
{
    public static IServiceCollection ConfigJWTAuth(this IServiceCollection services, IConfiguration config)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(op =>
        {
            op.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = config.GetValue<String>("JWTConfig:Issuer"),
                ValidateAudience = true,
                ValidAudience = config.GetValue<String>("JWTConfig:Audience"),
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetValue<String>("JWTConfig:SecretKey")!))
            };
        });
        return services;
    }
}