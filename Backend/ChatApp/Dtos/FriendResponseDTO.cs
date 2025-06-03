namespace ChatApp.Dtos;

public record FriendResponseDTO(String UserRequestedId, String UserWhoTriedToGetAFriendUserName, bool Accepted);