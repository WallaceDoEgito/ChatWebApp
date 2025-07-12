import {Injectable} from '@angular/core';
import * as signalR from "@microsoft/signalr"
import {ReplaySubject, Subject} from "rxjs";
import {UserInfoDTO} from "../../DTOs/UserInfoDTO";
import {MessageDTO} from "../../DTOs/MessageDTO";

@Injectable({
  providedIn: 'root'
})
export class SignalConnectService {
  private token: any = localStorage.getItem("JWTSession");
  private Connection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.Debug).withUrl("http://192.168.1.20:5269/chat", {skipNegotiation:true,transport:signalR.HttpTransportType.WebSockets,withCredentials:true,accessTokenFactory: () => this.token}).withAutomaticReconnect().build();
  private ConnectionSubject = new ReplaySubject<void>(1);
  private FriendRequestResponseSubject = new Subject<String>();
  private NewFriendSubject = new Subject<String>();
  private NewMessageSubject = new Subject<MessageDTO>();

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

  ComunicateConnection()
  {
    this.ConnectionSubject.next();
    console.log("Conectado via websockets")
    this.Connection.on("SendedFriendServerResponse", (req:any) => this.ServerResponseFriendReq$(req))
    this.Connection.on("NewFriendRequest", (req) => this.FriendRequest$(req))
    this.Connection.on("NewFriendAccepted", (req) => this.NewFriendAccepted$(req))
    this.Connection.on("NewMessage", (req) => this.NewMessage$(req))
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
