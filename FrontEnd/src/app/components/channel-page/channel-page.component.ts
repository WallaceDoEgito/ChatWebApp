import {Component, inject, input, InputSignal} from '@angular/core';
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {SignalConnectService} from "../../services/SignalConnect/signal-connect.service";

@Component({
  selector: 'app-channel-page',
  imports: [
    MatIconButton,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './channel-page.component.html',
  styleUrl: './channel-page.component.css'
})
export class ChannelPageComponent {
  ChannelSelected: InputSignal<ChannelDTO> = input.required<ChannelDTO>();
  private SignalRConnection = inject(SignalConnectService);
  WhiteImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
  MessageInputModel = "";

  async SendMessage()
  {
    if(this.MessageInputModel.trim() === "") return;
    console.log("Tentouo enviar algo ai " + this.MessageInputModel);
    await this.SignalRConnection.SendMessage(this.MessageInputModel, this.ChannelSelected().ChannelId);
    this.MessageInputModel = "";
  }
}
