import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelsComponent } from "../../components/channelsSideBar/channels.component";
import { SignalConnectService } from '../../services/SignalConnect/signal-connect.service';
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {DefaultChatPageComponent} from "../../components/default-chat-page/default-chat-page.component";

@Component({
  selector: 'app-chat-view',
  imports: [ChannelsComponent, DefaultChatPageComponent],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.css'
})
export class ChatViewComponent implements OnInit{
  private route = inject(Router)
  private signalRConnection = inject(SignalConnectService)
  public selectedChannel:ChannelDTO | undefined = undefined;

  async ngOnInit(): Promise<void> {
    const tokenJWT = localStorage.getItem("JWTSession");
    if(tokenJWT == null){
      await this.route.navigate(["/auth"]);
      return;
    }
    this.signalRConnection.TryConnect().then(e => this.signalRConnection.ComunicateConnection()).catch( async (e)=> {await this.route.navigate(["/auth"])})
  }

  NewChannelSelected(channelEmitted:ChannelDTO | undefined)
  {
    this.selectedChannel = channelEmitted;
  }



}
