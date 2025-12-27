import {Component, input, OnInit} from '@angular/core';
import {UserInfoDTO} from "../../../../DTOs/UserInfoDTO";
import {MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {GetProfilePicUrlFromUserSignal} from "../../../../services/ProfilePic/ProfilePicUrl";

@Component({
  selector: 'app-user-mini-profile',
  imports: [MatIconModule, MatIconButton],
  templateUrl: './user-mini-profile.component.html',
  styleUrl: './user-mini-profile.component.css'
})
export class UserMiniProfileComponent implements OnInit{
  public userInfo = input.required<UserInfoDTO>();
  public userProfilePic!:string

  ngOnInit() {
    this.userProfilePic = GetProfilePicUrlFromUserSignal(this.userInfo)
  }
}
