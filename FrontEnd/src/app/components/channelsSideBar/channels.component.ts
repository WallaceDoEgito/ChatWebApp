import { Component, inject, OnInit } from '@angular/core';
import { ChannelClickableComponent } from './channel-clickable/channel-clickable.component';
import { SignalConnectService } from '../../services/SignalConnect/signal-connect.service';
import { Channel } from '../../DTOs/Channel';
import {take} from "rxjs";
import {MatFormField} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-channels',
  imports: [ChannelClickableComponent, MatFormField, MatIconModule, MatButton],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.css'
})
export class ChannelsComponent implements OnInit {
  private SignalRS = inject(SignalConnectService)
  public ChannelList : Channel[] = []
  
  ngOnInit(): void {
    this.SignalRS.IsConnected$().pipe(take(1)).subscribe( async () => {
          this.ChannelList = await this.SignalRS.GetChannels();
    });

  }

}
