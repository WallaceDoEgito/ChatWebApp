import {Component, input, OnChanges, output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {ChannelDTO} from "../../../DTOs/ChannelDTO";
import {GetProfilePicUrlFromChannelSignal} from "../../../services/ProfilePic/ProfilePicUrl";

@Component({
  selector: 'app-channel-clickable',
  imports: [
    MatButtonModule,
  ],
  templateUrl: './channel-clickable.component.html',
  styleUrl: './channel-clickable.component.css'
})
export class ChannelClickableComponent implements OnChanges{
  public channel = input.required<ChannelDTO>();
  public clickEvent = output<ChannelDTO>();
  public isMinimized = input<boolean>(false);
  public ChannelImage!:string

  ngOnChanges() {
    this.ChannelImage = GetProfilePicUrlFromChannelSignal(this.channel)
  }

  public clickChannel()
  {
    this.clickEvent.emit(this.channel());
  }
}
