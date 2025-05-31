using ChatApp.Data;
using ChatApp.Extensions;
using ChatApp.Hubs;
using ChatApp.Interfaces;
using ChatApp.Services;
using ChatApp.Workers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<AppDbContext>();
builder.Services.AddScoped<ITokenService, TokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSignalR();
builder.Services.ConfigJWTAuth(builder.Configuration);
builder.Services.AddHostedService<MessageCreator>();
//builder.Services.AddHostedService<MessageDistribution>();
builder.Services.AddSingleton<RabbitMQConnection>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHub<PrincipalHub>("/chat");


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
