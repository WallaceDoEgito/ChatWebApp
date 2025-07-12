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

@Component({
  selector: 'app-channel-page',
  imports: [
    MatIconButton,
    MatIconModule,
    FormsModule,
    CommonModule,
    BrazilianDatePipePipe,
    MessageComponent
  ],
  templateUrl: './channel-page.component.html',
  styleUrl: './channel-page.component.css'
})
export class ChannelPageComponent implements OnChanges, OnInit{
  ChannelSelected: InputSignal<ChannelDTO> = input.required<ChannelDTO>();
  private SignalRConnection = inject(SignalConnectService);
  WhiteImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
  MessageInputModel = "";
  MessageIdEditing = "";

  async ngOnInit()
  {
    this.SignalRConnection.GetNewMessageObservable().subscribe( req => this.RefreshMessages())
    this.SignalRConnection.GetMessageEditedObservable().subscribe( req => this.MessageEditedOnChannel(req))
    this.SignalRConnection.GetMessageDeletedObservable().subscribe( req => this.MessageDeletedOnChannel(req))
  }
  async ngOnChanges() {
    await this.RefreshMessages();
  }

  async SendMessage()
  {
    if(this.MessageInputModel.trim() === "") return;
    console.log("Tentouo enviar algo ai " + this.MessageInputModel);
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
    console.log("Nova mensagem editada: ")
    console.log(newMessage)

    await this.SignalRConnection.EditMessageAsync(newMessage.messageId, newMessage.messageContent)
  }

  async DeleteMessage(messageId:string)
  {
    console.log("Mensagem para ser apagada")
    console.log(messageId)

    console.log(await this.SignalRConnection.DeleteMessageAsync(messageId))
  }

  protected readonly BrazilianDatePipePipe = BrazilianDatePipePipe;
}
