import {UserInfoDTO} from "./UserInfoDTO";

export class FriendRequestDTO {
    public UserThatSentInfo:UserInfoDTO;


    constructor(userInfo:UserInfoDTO) {
        this.UserThatSentInfo = userInfo;
    }
}