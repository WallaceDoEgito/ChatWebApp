import {Component, input, OnChanges, output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {ChannelDTO} from "../../../DTOs/ChannelDTO";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-channel-clickable',
  imports: [
    MatButtonModule,
    NgOptimizedImage
  ],
  templateUrl: './channel-clickable.component.html',
  styleUrl: './channel-clickable.component.css'
})
export class ChannelClickableComponent implements OnChanges{
  public channel = input.required<ChannelDTO>();
  public clickEvent = output<ChannelDTO>();
  public base64WhiteImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
  public ChannelImage!:string

  ngOnChanges() {
    this.ChannelImage = this.channel().ChannelImageUrl == "" ? this.base64WhiteImage : this.channel().ChannelImageUrl as string
  }

  public clickChannel()
  {
    this.clickEvent.emit(this.channel());
  }
}
