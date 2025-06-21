import {Component, input} from '@angular/core';
import {UserInfoDTO} from "../../DTOs/UserInfoDTO";
import {MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-user-mini-profile',
  imports: [MatIconModule, MatIconButton],
  templateUrl: './user-mini-profile.component.html',
  styleUrl: './user-mini-profile.component.css'
})
export class UserMiniProfileComponent {
  public userInfo = input.required<UserInfoDTO>();
  public base64WhiteImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
}
