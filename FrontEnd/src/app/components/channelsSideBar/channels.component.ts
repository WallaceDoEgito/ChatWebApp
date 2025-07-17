import {Component, inject, OnInit, output} from '@angular/core';
import { ChannelClickableComponent } from './channel-clickable/channel-clickable.component';
import { SignalConnectService } from '../../services/SignalConnect/signal-connect.service';
import { ChannelDTO } from '../../DTOs/ChannelDTO';
import {take} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserProfileComponent} from "./user-profile/user-profile.component";

@Component({
  selector: 'app-channels',
    imports: [ChannelClickableComponent, ReactiveFormsModule, MatIconModule, MatButton, FormsModule, MatIconButton, UserProfileComponent],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.css'
})
export class ChannelsComponent implements OnInit {
  private SignalRS = inject(SignalConnectService)
  public ChannelList : ChannelDTO[] = []
  public addFriends = false;
  public addFriendModel = '';
  public emitChannelSelected = output<ChannelDTO | undefined>()
  
  ngOnInit(): void {
    this.SignalRS.IsConnected$().pipe(take(1)).subscribe( async () => {
          let result = await this.SignalRS.GetChannels();
          for(let canal in result)
          {
            this.ChannelList.push(new ChannelDTO(result[canal].channelName, result[canal].channelId!, result[canal].creationDate!, result[canal].users!, [], result[canal].privateChannel!, result[canal].channelProfilePic!))
          }
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

}
