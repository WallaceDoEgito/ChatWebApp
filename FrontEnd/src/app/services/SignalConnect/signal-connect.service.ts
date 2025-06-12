import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SignalConnectService {
  private token: any = localStorage.getItem("JWTSession");
  private Connection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.Debug).withUrl("http://localhost:5269/chat", {accessTokenFactory: () => this.token}).withAutomaticReconnect().build();
  private ConnectionSubject = new ReplaySubject<void>(1);

  IsConnected$() {
    return this.ConnectionSubject.asObservable();
  }

  ComunicateConnection()
  {
    this.ConnectionSubject.next();
    console.log("Conectado via websockets")
  }

  TryConnect(): Promise<void> {
    return this.Connection.start()
  }
  
  public async GetChannels()
  {
    const ChannelList = await this.Connection.invoke("GetChannelList");
    return ChannelList;
  }

}
