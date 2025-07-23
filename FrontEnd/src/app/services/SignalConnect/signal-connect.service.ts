import {Injectable} from '@angular/core';
import * as signalR from "@microsoft/signalr"
import {ReplaySubject, Subject} from "rxjs";
import {UserInfoDTO} from "../../DTOs/UserInfoDTO";
import {MessageDTO} from "../../DTOs/MessageDTO";
import {MessageDeletedEvent} from "../../DTOs/MessageDeletedEvent";
import {MessageEditedEvent} from "../../DTOs/MessageEditedEvent";

@Injectable({
  providedIn: 'root'
})
export class SignalConnectService {
  private url = "";
  private Connection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.Debug).withUrl(`${this.url}/chat`, {skipNegotiation:true,transport:signalR.HttpTransportType.WebSockets,withCredentials:true,accessTokenFactory: () => this.GetToken()}).withAutomaticReconnect().build();
  private ConnectionSubject = new ReplaySubject<void>(1);
  private FriendRequestResponseSubject = new Subject<String>();
  private NewFriendSubject = new Subject<String>();
  private NewMessageSubject = new Subject<MessageDTO>();
  private MessageDeletedSubject = new Subject<MessageDeletedEvent>();
  private MessageEditedSubject = new Subject<MessageEditedEvent>();

  private GetToken():string
  {
    return localStorage.getItem("JWTSession") ?? ""
  }
  IsConnected$() {
    return this.ConnectionSubject.asObservable();
  }

  GetNewFriendObservable$()
  {
    return this.NewFriendSubject.asObservable();
  }

  GetNewFriendRequestObservable$()
  {
    return this.FriendRequestResponseSubject.asObservable();
  }

  GetNewMessageObservable()
  {
    return this.NewMessageSubject.asObservable();
  }

  GetMessageDeletedObservable()
  {
    return this.MessageDeletedSubject.asObservable();
  }

  GetMessageEditedObservable()
  {
    return this.MessageEditedSubject.asObservable();
  }

  private FriendRequest$(FriendReqUsername:String)
  {
    this.FriendRequestResponseSubject.next(FriendReqUsername);
  }
  private NewFriendAccepted$(UsernameFriendAccepted:String)
  {
    this.NewFriendSubject.next(UsernameFriendAccepted)
  }

  private NewMessage$(req:any)
  {
    console.log("tchuru tchuru Chegou mensagem pra voce");
    console.log(req)
    this.NewMessageSubject.next(req)
  }

  private ServerResponseFriendReq$(req:any)
  {

  }

  private MessageDeletedInChannel$(req:MessageDeletedEvent)
  {
    this.MessageDeletedSubject.next(req);
  }

  private MessageEditedInChannel$(req:MessageEditedEvent)
  {
    this.MessageEditedSubject.next(req);
  }

  ComunicateConnection()
  {
    this.ConnectionSubject.next();
    this.Connection.on("SendedFriendServerResponse", (req:any) => this.ServerResponseFriendReq$(req))
    this.Connection.on("NewFriendRequest", (req) => this.FriendRequest$(req))
    this.Connection.on("NewFriendAccepted", (req) => this.NewFriendAccepted$(req))
    this.Connection.on("NewMessage", (req) => this.NewMessage$(req))
    this.Connection.on("MessageDeletedInChannel", (req) => this.MessageDeletedInChannel$(req))
    this.Connection.on("MessageEditedInChannel", (req) => this.MessageEditedInChannel$(req))
  }

  TryConnect(): Promise<void> {
    return this.Connection.start()
  }

  public async GetChannels()
  {
    return await this.Connection.invoke("GetChannelList");
  }

  public async GetFriends(): Promise<UserInfoDTO[]>
  {
    let friends: UserInfoDTO[] = await this.Connection.invoke("GetFriends");
    return friends;
  }

  public async GetFriendRequests() : Promise<UserInfoDTO[]>
  {
    let reqs : UserInfoDTO[] = await this.Connection.invoke("GetFriendRequests");
    return reqs;
  }

  public async FriendRequest(nicknameToRequest:String): Promise<boolean>
  {
    return await this.Connection.invoke("FriendRequest", nicknameToRequest)
  }

  public async FriendRequestResponse(userIdWhoRequested :String, response : boolean)
  {
      await this.Connection.send("FriendResponse", userIdWhoRequested, response);
  }

  public async SendMessage(messageContent:String, channelId:String)
  {
    await this.Connection.send("SendMessage", messageContent, channelId);
  }

  public async GetMessagesByChannelId(channelId:String, page:number) : Promise<MessageDTO[]>
  {
    return this.Connection.invoke("GetMessageByChannelAndPage", channelId, page)
  }

  public async GetCurrentUserInfoAsync():Promise<UserInfoDTO>
  {
    return this.Connection.invoke("GetCurrentUserInfo")
  }

  public async DeleteMessageAsync(messageId:string)
  {
    return this.Connection.send("DeleteMessageById", messageId);
  }

  public async EditMessageAsync(messageId:string, newMessage:string)
  {
    return this.Connection.send("EditMessageById", messageId, newMessage)
  }
}
