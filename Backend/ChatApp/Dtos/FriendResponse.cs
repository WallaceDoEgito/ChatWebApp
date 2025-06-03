namespace ChatApp.Dtos;

public record FriendResponse(String UserRequestedId, String UserWhoTriedToGetAFriend, bool Accepted);