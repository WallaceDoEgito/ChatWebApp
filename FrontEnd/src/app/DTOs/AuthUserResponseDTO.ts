import { ResponsesEnum } from "../services/Auth/ResponsesEnum";

export class AuthUserResponseDTO
{
    public ResponseType: ResponsesEnum
    public MessageBody: String | null | undefined

    constructor(type:ResponsesEnum, body:String|null|undefined) {
        this.ResponseType = type;
        this.MessageBody = body;
    }
}