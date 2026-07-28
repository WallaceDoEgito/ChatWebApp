import {Component, input, OnChanges, output, OnInit, signal, inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {ChannelDTO} from "../../../../DTOs/ChannelDTO"
import {GetProfilePicUrlFromChannelSignal} from "../../../../services/ProfilePic/ProfilePicUrl";
import {SignalConnectService} from "../../../../services/SignalConnect/signal-connect.service";
import {MatBadgeModule} from '@angular/material/badge';
import {UserInfoService} from "../../../../services/UserInfo/user-info.service";
import {RouteUtilsService} from "../../../../services/Utils/RouteUtils/route-utils.service";

@Component({
  selector: 'app-channel-clickable',
  imports: [
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './channel-clickable.component.html',
  styleUrl: './channel-clickable.component.css'
})
export class ChannelClickableComponent implements OnChanges, OnInit{
  public channel = input.required<ChannelDTO>();
  public clickEvent = output<ChannelDTO>();
  public isMinimized = input<boolean>(false);
  public ChannelImage!:string
  public countHowManyNewMessages = signal(0)
  private signalRService = inject(SignalConnectService)
  private userInfoService = inject(UserInfoService)
  private RouteUtils = inject(RouteUtilsService)

  ngOnChanges() {
    this.ChannelImage = GetProfilePicUrlFromChannelSignal(this.channel)
  }
  ngOnInit() {
    this.signalRService.GetNewMessageObservable().subscribe(req => this.onNewMessage(req))
  }

  public clickChannel()
  {
    this.cleanNewMessagesTooltip();
    this.clickEvent.emit(this.channel());
  }
  
  private async onNewMessage(req: any)
  {
    let currentUser = await this.userInfoService.GetUserInfo()
    let messageFromAnotherUser = req.userThatSended.userId !== currentUser.userId;
    let isThisComponentChannel = req.channelId == this.channel().ChannelId
    if(isThisComponentChannel && messageFromAnotherUser)
    {
      let currentActiveChannelUrlId = this.RouteUtils.GetCurrentChannelIdIfActive()
      
      if(currentActiveChannelUrlId !== "" && currentActiveChannelUrlId === req.channelId) return;
      
      this.countHowManyNewMessages.update(val => val + 1)
    }
  }
  
  private cleanNewMessagesTooltip()
  {
    this.countHowManyNewMessages.set(0)
  }
}
