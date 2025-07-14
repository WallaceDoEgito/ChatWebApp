import {Component, input, OnInit} from '@angular/core';
import {UserInfoDTO} from "../../DTOs/UserInfoDTO";
import {MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-user-mini-profile',
  imports: [MatIconModule, MatIconButton],
  templateUrl: './user-mini-profile.component.html',
  styleUrl: './user-mini-profile.component.css'
})
export class UserMiniProfileComponent implements OnInit{
  public userInfo = input.required<UserInfoDTO>();
  public base64WhiteImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
  public userProfilePic!:string

  ngOnInit() {
    this.userProfilePic = this.userInfo().userProfilePicUrl == "" ? this.base64WhiteImage : this.userInfo().userProfilePicUrl as string
  }
}
