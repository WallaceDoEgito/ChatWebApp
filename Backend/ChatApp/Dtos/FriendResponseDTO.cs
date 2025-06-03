namespace ChatApp.Dtos;

public record FriendResponseDTO(String UserRequestedId, String UserWhoTriedToGetAFriendId, bool Accepted);