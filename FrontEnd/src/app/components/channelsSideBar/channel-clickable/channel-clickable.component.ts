import {Component, input, output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {Channel} from "../../../DTOs/Channel";
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
export class ChannelClickableComponent {
  public channel = input.required<Channel>();
  public clickEvent = output<Channel>();
  public base64WhiteImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="

  public clickChannel()
  {
    this.clickEvent.emit(this.channel());
  }
}
