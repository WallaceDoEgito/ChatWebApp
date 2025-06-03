using System.Diagnostics.CodeAnalysis;

namespace ChatApp.Models;

public class FriendRequest
{ 
    public required Guid UserId { get; set; }
    public User User { get; set; }
    
    public required Guid UserToRequestId { get; set; }
    public User UserToRequest { get; set; }

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