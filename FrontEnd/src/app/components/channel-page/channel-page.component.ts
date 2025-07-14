import {Component, inject, input, InputSignal, OnChanges, OnInit} from '@angular/core';
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {SignalConnectService} from "../../services/SignalConnect/signal-connect.service";
import {CommonModule} from "@angular/common";
import {BrazilianDatePipePipe} from "../../pipes/brazilian-date-pipe.pipe";
import {MessageComponent} from "../message/message.component";
import {MessageDTO} from "../../DTOs/MessageDTO";
import {MessageEditedEvent} from "../../DTOs/MessageEditedEvent";
import {MessageDeletedEvent} from "../../DTOs/MessageDeletedEvent";
import {UserInfoService} from "../../services/UserInfo/user-info.service";

@Component({
  selector: 'app-channel-page',
  imports: [
    MatIconButton,
    MatIconModule,
    FormsModule,
    CommonModule,
    MessageComponent
  ],
  templateUrl: './channel-page.component.html',
  styleUrl: './channel-page.component.css'
})
export class ChannelPageComponent implements OnChanges, OnInit{
  ChannelSelected: InputSignal<ChannelDTO> = input.required<ChannelDTO>();
  private SignalRConnection = inject(SignalConnectService);
  WhiteImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
  ChannelImage!:string
  MessageInputModel = "";
  MessageIdEditing = "";

  userInfo = inject(UserInfoService);

  async ngOnInit()
  {
    this.SignalRConnection.GetNewMessageObservable().subscribe( req => this.NewMessageArrived(req))
    this.SignalRConnection.GetMessageEditedObservable().subscribe( req => this.MessageEditedOnChannel(req))
    this.SignalRConnection.GetMessageDeletedObservable().subscribe( req => this.MessageDeletedOnChannel(req))
    await this.userInfo.LoadUser();
  }
  async ngOnChanges() {
    await this.RefreshMessages();
    this.ChannelImage = this.ChannelImage = this.ChannelSelected().ChannelImageUrl == "" ? this.WhiteImageBase64 : this.ChannelSelected().ChannelImageUrl as string
  }

  async SendMessage()
  {
    if(this.MessageInputModel.trim() === "") return;
    await this.SignalRConnection.SendMessage(this.MessageInputModel, this.ChannelSelected().ChannelId);
    this.MessageInputModel = "";
  }

  async RefreshMessages()
  {
    let mes = await this.SignalRConnection.GetMessagesByChannelId(this.ChannelSelected().ChannelId, 1)
    this.ChannelSelected().Messages = []
    for(let message of mes)
    {
      this.ChannelSelected().Messages.push(message);
    }
  }

  NewMessageArrived(req : MessageDTO)
  {
    if(req.channelId != this.ChannelSelected().ChannelId) return;
    this.ChannelSelected().Messages.unshift(req);
  }

  MessageEditedOnChannel(req:MessageEditedEvent)
  {
    if(this.ChannelSelected().ChannelId != req.channelId) return;
    for(let i = 0; i < this.ChannelSelected().Messages.length; i++) {
      if (this.ChannelSelected().Messages[i].messageId == req.messageId) {
        this.ChannelSelected().Messages[i].edited = true;
        this.ChannelSelected().Messages[i].messageContent = req.newMessage;
        break;
      }
    }
  }

  MessageDeletedOnChannel(req:MessageDeletedEvent)
  {
    if(this.ChannelSelected().ChannelId != req.channelId) return;
    for(let i = 0; i < this.ChannelSelected().Messages.length; i++) {
      if (this.ChannelSelected().Messages[i].messageId == req.messageId) {
        this.ChannelSelected().Messages.splice(i,1);
        break;
      }
    }
  }

  IsEditingAtMoment(messageId:string)
  {
    return this.MessageIdEditing === messageId;
  }

  EditMessageMutex(messageId:string)
  {
    this.MessageIdEditing = messageId;
  }

  NoMoreEditing()
  {
    this.MessageIdEditing = "";
  }

  async EditedMessage(newMessage:MessageDTO)
  {
    this.MessageIdEditing = "";
    await this.SignalRConnection.EditMessageAsync(newMessage.messageId, newMessage.messageContent)
  }

  async DeleteMessage(messageId:string)
  {
    console.log(await this.SignalRConnection.DeleteMessageAsync(messageId))
  }

  protected readonly BrazilianDatePipePipe = BrazilianDatePipePipe;
}
