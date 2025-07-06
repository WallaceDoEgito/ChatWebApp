export interface MessageDTO {
    messageId:string;
    userIdThatSended:string;
    userNameThatSended:string;
    channelId:string;
    messageContent:string;
    sendAt:string;
    edited:boolean;
}