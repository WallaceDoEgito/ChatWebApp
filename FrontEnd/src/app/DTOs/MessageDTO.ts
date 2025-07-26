import {UserInfoDTO} from "./UserInfoDTO";

export interface MessageDTO {
    messageId:string;
    channelId:string;
    userThatSended:UserInfoDTO
    messageContent:string;
    sendAt:string;
    edited:boolean;
    temp:boolean
}