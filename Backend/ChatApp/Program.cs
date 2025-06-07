using ChatApp.Data;
using ChatApp.Extensions;
using ChatApp.Hubs;
using ChatApp.Interfaces;
using ChatApp.Services;
using ChatApp.Workers;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<AppDbContext>();
builder.Services.AddScoped<ITokenService, TokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSignalR().AddStackExchangeRedis(builder.Configuration.GetValue<String>("RedisConnectionString")!,
    options =>
    {
        options.Configuration.ChannelPrefix = $"SignalHubBackPlane_";
    });
builder.Services.ConfigJWTAuth(builder.Configuration);
builder.Services.AddCors(op =>
{
    op.AddDefaultPolicy((builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    }));
});
builder.Services.AddSingleton<RabbitMQConnection>();
builder.Services.AddHostedService<MessageCreator>();
builder.Services.AddHostedService<MessageDemux>();
builder.Services.AddHostedService<MessageDistribution>();
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect(builder.Configuration.GetValue<String>("RedisConnectionString")!));
builder.Services.AddSingleton<RedisService>();
builder.Services.AddScoped<IFriendService, FriendService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors();

app.MapHub<PrincipalHub>("/chat");

app.MapControllers();

app.Run();
