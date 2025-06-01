using StackExchange.Redis;

namespace ChatApp.Data;

public class RedisService(IConnectionMultiplexer redis)
{
    private readonly IDatabase _db = redis.GetDatabase();
    private readonly String _connectedUsersSet = "online:users:";
    private readonly String _usersConnections = "users:connections:";
    
    
    public async Task UserConnectedAsync(String userId, String connectionId)
    {
        await _db.SetAddAsync(_connectedUsersSet, userId);
        await _db.SetAddAsync($"{_usersConnections}{userId}", connectionId);
        await _db.KeyExpireAsync($"{_usersConnections}{userId}", TimeSpan.FromDays(1));
    }

    public async Task UserDisconnected(String userId, String connectionId)
    {
        await _db.SetRemoveAsync($"{_usersConnections}{userId}", connectionId);
        var lengthConnectionsUser = await _db.SetLengthAsync($"{_usersConnections}{userId}");
        if (lengthConnectionsUser == 0)
        {
            await _db.SetRemoveAsync(_connectedUsersSet, userId);
            await _db.KeyDeleteAsync($"{_usersConnections}{userId}");
        }
    }


    public async Task<bool> CheckUserOnline(String userId)
    {
        var online = await _db.SetContainsAsync(_connectedUsersSet, userId);
        return online;
    }

    public async Task<IEnumerable<String>> GetUserConnections(String userId)
    {
        var connections = await _db.SetMembersAsync($"{_usersConnections}{userId}");
        return connections.Select(x => x.ToString());
    }
}