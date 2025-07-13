import { MessageDTO } from "./MessageDTO";
import { UserInfoDTO } from "./UserInfoDTO";

export class ChannelDTO {
    public ChannelName : String
    public ChannelId : String
    public CreatedAt : String
    public ChannelImageUrl:String = ""
    public Participants : UserInfoDTO[]
    public Messages : MessageDTO[]
    public PrivateChannel:boolean
    
    constructor(channelName : String, channelId : String, createdDate : String, participants: UserInfoDTO[], messages: MessageDTO[], privateChannel:boolean, channelProfilePicUrl:string) {
        this.ChannelName = channelName;
        this.ChannelId = channelId;
        this.CreatedAt = createdDate;
        this.Participants = participants;
        this.Messages = messages;
        this.ChannelImageUrl = channelProfilePicUrl;
        this.PrivateChannel = privateChannel;
    }
}