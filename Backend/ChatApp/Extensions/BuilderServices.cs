using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3;
using ChatApp.Data;
using ChatApp.Interfaces;
using ChatApp.Services;
using ChatApp.Services.FileUpload;
using ChatApp.Workers;
using StackExchange.Redis;

namespace ChatApp.Extensions;

public static class BuilderServices
{
    public static IServiceCollection ConfigureCloudProvider(this IServiceCollection service,
        IConfiguration configuration)
    {
        if (configuration.GetValue<string>("AWS:Credentials:SecretKey") != "SecretKey Here")
        {
            AWSOptions awsOptions = configuration.GetAWSOptions();
            awsOptions.Credentials = new BasicAWSCredentials(
                configuration.GetValue<string>("AWS:Credentials:AccessKey"),
                configuration.GetValue<string>("AWS:Credentials:SecretKey"));

            service.AddDefaultAWSOptions(awsOptions);
            service.AddAWSService<IAmazonS3>();
            service.AddScoped<ICloudProviderStrategy, AwsS3Bucket>();
        }
        else
        {
            service.AddScoped<ICloudProviderStrategy, InMemory>();
        }

        return service;
    }

    public static IServiceCollection ConfigureDependencyInjection(this IServiceCollection service)
    {
        service.AddScoped<IHasher, BcryptPasswordHasher>();
        service.AddScoped<ITokenService, TokenGenerator>();
        service.AddScoped<IAuthService, AuthService>();
        service.AddScoped<IGetInfo, GetInfoService>();
        service.AddScoped<IMessageService, MessageModifyService>();
        service.AddScoped<IFileService, FileService>();
        service.AddScoped<IFriendService, FriendService>();

        return service;
    }

    public static IServiceCollection ConfigureServices(this IServiceCollection service, IConfiguration configuration)
    {
        service.AddScoped<AppDbContext>();
        service.AddSingleton<RabbitMQConnection>();
        service.AddHostedService<MessageCreator>();
        service.AddHostedService<MessageDemux>();
        service.AddHostedService<MessageDistribution>();
        service.AddSingleton<RedisService>();

        service.AddSignalR().AddStackExchangeRedis(
            configuration.GetValue<string>("RedisConnectionString") ?? "localhost",
            options => { options.Configuration.ChannelPrefix = RedisChannel.Literal("SignalHubBackPlane"); });

        service.AddSingleton<IConnectionMultiplexer>(
            ConnectionMultiplexer.Connect(configuration.GetValue<string>("RedisConnectionString") ?? "localhost"));

        return service;
    }
}