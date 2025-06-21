export class MessageDTO {
    public UserIdThatSent : String;
    public UserNameThatSent : String;
    public MessageContent : String

    constructor(userid : String, username: String, messageContent : String) {
        this.UserIdThatSent = userid;
        this.UserNameThatSent = username;
        this.MessageContent = messageContent;
    }
}