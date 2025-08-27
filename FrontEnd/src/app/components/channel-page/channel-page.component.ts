import {Component, computed, inject, input, InputSignal, OnChanges, OnInit} from '@angular/core';
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
import {GetProfilePicUrlFromChannelSignal} from "../../services/ProfilePic/ProfilePicUrl";
import {AutomaticFocusDirective} from "../../Directives/automatic-focus.directive";

@Component({
  selector: 'app-channel-page',
  imports: [
    MatIconButton,
    MatIconModule,
    FormsModule,
    CommonModule,
    MessageComponent,
    AutomaticFocusDirective
  ],
  templateUrl: './channel-page.component.html',
  styleUrl: './channel-page.component.css'
})
export class ChannelPageComponent implements OnChanges, OnInit{
  ChannelSelected: InputSignal<ChannelDTO> = input.required<ChannelDTO>();
  private SignalRConnection = inject(SignalConnectService);
  ChannelImage!:string
  MessageInputModel = "";
  MessageIdEditing = "";

  Width = input<string>("80vw");
  InputWidth = computed(() => {
    let widthAsNum = +this.Width().slice(0,2)
    return (widthAsNum - 10) + "vw"
  })


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
    this.ChannelImage = GetProfilePicUrlFromChannelSignal(this.ChannelSelected)
  }

  async SendMessage()
  {
    if(this.MessageInputModel.trim() === "") return;
    await this.SignalRConnection.SendMessage(this.MessageInputModel, this.ChannelSelected().ChannelId);
    this.ChannelSelected().Messages.unshift(
        {
          messageId: `temp${this.MessageInputModel.trim()}${new Date().toISOString()}${Math.random()}`,
          channelId: 'temp',
          userThatSended: this.userInfo.GetUserInfo(),
          messageContent: this.MessageInputModel.trim(),
          sendAt: new Date().toISOString(),
          edited: false,
          temp: true
        }
    );
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
    this.RemoveTempMessage(req)
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

  private RemoveTempMessage(messageToSearch:MessageDTO) {
    for (let i = 0; i < this.ChannelSelected().Messages.length; i++)
    {
      if(this.ChannelSelected().Messages[i].messageContent.trim() == messageToSearch.messageContent.trim())
      {
        this.ChannelSelected().Messages.splice(i,1);
        return;
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
    await this.SignalRConnection.DeleteMessageAsync(messageId)
  }

  protected readonly BrazilianDatePipePipe = BrazilianDatePipePipe;
}
