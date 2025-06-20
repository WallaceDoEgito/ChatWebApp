import {Component, inject, OnInit, output} from '@angular/core';
import { ChannelClickableComponent } from './channel-clickable/channel-clickable.component';
import { SignalConnectService } from '../../services/SignalConnect/signal-connect.service';
import { Channel } from '../../DTOs/Channel';
import {take} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-channels',
  imports: [ChannelClickableComponent, ReactiveFormsModule, MatIconModule, MatButton, FormsModule, MatIconButton],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.css'
})
export class ChannelsComponent implements OnInit {
  private SignalRS = inject(SignalConnectService)
  public ChannelList : Channel[] = []
  public addFriends = false;
  public addFriendModel = '';
  public emitChannelSelected = output<Channel | undefined>()
  
  ngOnInit(): void {
    this.SignalRS.IsConnected$().pipe(take(1)).subscribe( async () => {
          let result = await this.SignalRS.GetChannels();
          console.log(result);
          for(let canal in result)
          {
            this.ChannelList.push(new Channel(result[canal].channelName, result[canal].channelId!, result[canal].creationDate!, result[canal].users!, []))
          }
          console.log(this.ChannelList)
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

  public SelectChannel(channel:Channel | undefined)
  {
    this.emitChannelSelected.emit(channel);
  }

}
