import { Component, inject, OnInit } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { ChannelsComponent } from "../../components/Hub/channelsSideBar/channels.component";
import { SignalConnectService } from '../../services/SignalConnect/signal-connect.service';

@Component({
  selector: 'app-chat-view',
    imports: [ChannelsComponent, RouterOutlet],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.css'
})
export class ChatViewComponent implements OnInit{
  private route = inject(Router)
  private signalRConnection = inject(SignalConnectService)
  public SideBarIsMinimized = false;
  public WidthForChannelComponent = "80vw";

  async ngOnInit(): Promise<void> {
    const tokenJWT = localStorage.getItem("JWTSession");
    if(tokenJWT == null){
      await this.route.navigate(["/auth"]);
      return;
    }
    this.signalRConnection.TryConnect().then(e => this.signalRConnection.ComunicateConnection()).catch( async (e)=> {await this.route.navigate(["/auth"])})
  }

  SidebarStateHandler(SideBarMinimized:boolean)
  {
    this.SideBarIsMinimized = SideBarMinimized
    this.SideBarIsMinimized ? this.WidthForChannelComponent = "95vw" : this.WidthForChannelComponent = "80vw";
  }

}
