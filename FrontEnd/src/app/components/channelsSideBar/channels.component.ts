import { Component, inject, OnInit } from '@angular/core';
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
  
  ngOnInit(): void {
    this.SignalRS.IsConnected$().pipe(take(1)).subscribe( async () => {
          this.ChannelList = await this.SignalRS.GetChannels();
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

}
