export class AuthUserRequestDTO
{
    public userName : String;
    public password : String;

    constructor(UserName:String, Password:String) {
        this.userName = UserName;
        this.password = Password;  
    }
}