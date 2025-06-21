export class UserInfoDTO {
    public UserName : String
    public UserId:String
    public UserProfilePicUrl = ""

    constructor(username:string, userid:string) {
        this.UserName = username;
        this.UserId = userid;
        
    }
}