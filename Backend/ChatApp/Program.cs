using ChatApp.Data;
using ChatApp.Extensions;
using ChatApp.Hubs;
using ChatApp.Interfaces;
using ChatApp.Services;
using ChatApp.Workers;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<AppDbContext>();
builder.Services.AddScoped<ITokenService, TokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IGetInfo, GetInfoService>();
builder.Services.AddScoped<IMessageService, MessageModifyService>();
builder.Services.AddSignalR().AddStackExchangeRedis(builder.Configuration.GetValue<String>("RedisConnectionString") ?? "localhost",
    options =>
    {
        options.Configuration.ChannelPrefix = RedisChannel.Literal("SignalHubBackPlane");
    });
builder.Services.ConfigJWTAuth(builder.Configuration);
builder.Services.AddCors(op =>
{
    op.AddDefaultPolicy((builderCors =>
    {
//         builderCors.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        builderCors.SetIsOriginAllowed(origin =>
                    origin == "http://localhost:4200" ||
                    origin == "https://localhost:4000")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
    }));
});
builder.Services.AddSingleton<RabbitMQConnection>();
builder.Services.AddHostedService<MessageCreator>();
builder.Services.AddHostedService<MessageDemux>();
builder.Services.AddHostedService<MessageDistribution>();
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect(builder.Configuration.GetValue<String>("RedisConnectionString") ?? "localhost"));
builder.Services.AddSingleton<RedisService>();
builder.Services.AddScoped<IFriendService, FriendService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

await app.Services.ApplyMigrationsAsync();

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors();

app.MapHub<PrincipalHub>("/chat");

app.MapControllers();

app.Run();
