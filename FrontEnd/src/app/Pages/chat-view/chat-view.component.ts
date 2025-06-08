import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-chat-view',
  imports: [],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.css'
})
export class ChatViewComponent implements OnInit{
  private token : any = localStorage.getItem("JWTSession");
  private Connection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.Debug).withUrl("http://localhost:5269/chat", {accessTokenFactory: () => this.token}).withAutomaticReconnect().build();
  private route = inject(Router)
  async ngOnInit(): Promise<void> {
    const tokenJWT = localStorage.getItem("JWTSession");
    if(tokenJWT == null){
      this.route.navigate(["/auth"]);
      return;
    }
    this.Connection.start().then(()=> {console.log("Conectei!")}).catch((e) =>{console.log(e); this.route.navigate(["/auth"]);})

  }

}
