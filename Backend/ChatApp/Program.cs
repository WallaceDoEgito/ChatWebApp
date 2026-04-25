using ChatApp.Extensions;
using ChatApp.Hubs;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigJWTAuth(builder.Configuration);
builder.Services.ConfigureDependencyInjection();
builder.Services.ConfigureServices(builder.Configuration);
builder.Services.ConfigureCloudProvider(builder.Configuration);

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