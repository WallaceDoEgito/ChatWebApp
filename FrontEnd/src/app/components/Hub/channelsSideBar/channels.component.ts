import {Component, inject, OnInit, output} from '@angular/core';
import { ChannelClickableComponent } from './channel-clickable/channel-clickable.component';
import { SignalConnectService } from '../../../services/SignalConnect/signal-connect.service';
import { ChannelDTO } from '../../../DTOs/ChannelDTO';
import {take} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-channels',
  imports: [ChannelClickableComponent, ReactiveFormsModule, MatIconModule, MatButton, FormsModule, MatIconButton, UserProfileComponent, MatBadge],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.css'
})
export class ChannelsComponent implements OnInit {
  private SignalRS = inject(SignalConnectService)
  public ChannelList : ChannelDTO[] = []
  public addFriends = false;
  public addFriendModel = '';
  public emitChannelSelected = output<ChannelDTO | undefined>()
  public howManyNewFriendRequests = 0;
  public SideBarMinimized = false;
  public SideBarMinimizedEvent = output<boolean>();
  
  ngOnInit(): void {
    this.SignalRS.IsConnected$().pipe(take(1)).subscribe( async () => {
          await this.RefreshChannels();
          this.SignalRS.GetNewFriendObservable$().subscribe(req => this.RefreshChannels())
          this.SignalRS.GetNewFriendRequestObservable$().subscribe(req => this.howManyNewFriendRequests++);
    });
  }

  AddFriendsToggle(){
    this.addFriends = !this.addFriends
    this.addFriendModel = '';
  }

  async SendFriendRequest()
  {
    let wasSuccesfull = await this.SignalRS.FriendRequest(this.addFriendModel);
    this.addFriendModel = '';
  }

  public SelectChannel(channel:ChannelDTO | undefined)
  {
    this.emitChannelSelected.emit(channel);
  }

  private async RefreshChannels()
  {
    let result = await this.SignalRS.GetChannels();
    this.ChannelList = []
    for(let canal in result)
    {
      this.ChannelList.push(new ChannelDTO(result[canal].channelName, result[canal].channelId!, result[canal].creationDate!, result[canal].users!, [], result[canal].privateChannel!, result[canal].channelProfilePic!))
    }
  }

}
