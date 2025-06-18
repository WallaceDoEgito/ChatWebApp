import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelsComponent } from "../../components/channelsSideBar/channels.component";
import { ChannelPageComponent } from '../../components/channel-page/channel-page.component';
import { DefaultPageComponent } from '../../components/default-page/default-page.component';
import { SignalConnectService } from '../../services/SignalConnect/signal-connect.service';

@Component({
  selector: 'app-chat-view',
  imports: [ChannelsComponent, ChannelPageComponent, DefaultPageComponent],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.css'
})
export class ChatViewComponent implements OnInit{
  private route = inject(Router)
  private signalRConnection = inject(SignalConnectService)
  public selectedChannelId = ""

  async ngOnInit(): Promise<void> {
    const tokenJWT = localStorage.getItem("JWTSession");
    if(tokenJWT == null){
      this.route.navigate(["/auth"]);
      return;
    }
    this.signalRConnection.TryConnect().then(e => this.signalRConnection.ComunicateConnection()).catch( e => {console.error(e);this.route.navigate(["/auth"])})
  }

  async NewChannelSelected(Event:any)
  {
    // this.selectedChannelId = ;
  }



}
