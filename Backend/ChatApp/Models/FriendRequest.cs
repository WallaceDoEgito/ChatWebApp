using System.Diagnostics.CodeAnalysis;

namespace ChatApp.Models;

public class FriendRequest
{ 
    public required Guid UserId { get; set; } = Guid.Empty;
    public User User { get; set; } = null!;
    
    public required Guid UserToRequestId { get; set; } = Guid.Empty;
    public User UserToRequest { get; set; } = null!;

    public bool Accepted { get; set; }
    public required DateTime RequestTimeUtc { get; set; }
    
    public FriendRequest(){}
    
    [SetsRequiredMembers]
    public FriendRequest(Guid userId, Guid userToRequestId)
    {
        UserId = userId;
        UserToRequestId = userToRequestId;
        RequestTimeUtc = DateTime.UtcNow;
        Accepted = false;
    }
}