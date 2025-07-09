import {Component, inject, input, InputSignal, OnChanges, OnInit} from '@angular/core';
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {SignalConnectService} from "../../services/SignalConnect/signal-connect.service";
import {CommonModule} from "@angular/common";
import {BrazilianDatePipePipe} from "../../pipes/brazilian-date-pipe.pipe";

@Component({
  selector: 'app-channel-page',
  imports: [
    MatIconButton,
    MatIconModule,
    FormsModule,
    CommonModule,
      BrazilianDatePipePipe
  ],
  templateUrl: './channel-page.component.html',
  styleUrl: './channel-page.component.css'
})
export class ChannelPageComponent implements OnChanges, OnInit{
  ChannelSelected: InputSignal<ChannelDTO> = input.required<ChannelDTO>();
  private SignalRConnection = inject(SignalConnectService);
  WhiteImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
  MessageInputModel = "";

  async ngOnInit()
  {
    this.SignalRConnection.GetNewMessageObservable().subscribe( req => this.RefreshMessages())
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

  CompareDates(isoStringOne:string, isoStringTwo:string): boolean
  {
    let DateOne = new Date(isoStringOne);
    let DateTwo = new Date(isoStringTwo);

    console.log(`Comparando: ${isoStringOne} com ${isoStringTwo}`)
    console.log(`Uma possui dia: ${DateOne.getDate()} e a outra ${DateTwo.getDate()}`)
    return DateOne.getDate() != DateTwo.getDate();
  }

  protected readonly BrazilianDatePipePipe = BrazilianDatePipePipe;
}
