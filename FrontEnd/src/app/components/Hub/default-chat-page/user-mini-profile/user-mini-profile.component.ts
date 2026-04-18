import {Component, inject, input, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {GetProfilePicUrlFromUserSignal} from "../../../../services/ProfilePic/ProfilePicUrl";
import {Router} from "@angular/router";
import {FriendInfoDTO} from "../../../../DTOs/FriendInfoDTO";

@Component({
  selector: 'app-user-mini-profile',
  imports: [MatIconModule, MatIconButton],
  templateUrl: './user-mini-profile.component.html',
  styleUrl: './user-mini-profile.component.css'
})
export class UserMiniProfileComponent implements OnInit{
  public userInfo = input.required<FriendInfoDTO>();
  private router = inject(Router)
  public userProfilePic!:string

  ngOnInit() {
    this.userProfilePic = GetProfilePicUrlFromUserSignal(this.userInfo)
  }

  async messageClick()
  {
      return await this.router.navigate(['hub','channel',`${this.userInfo().privateChannelId}`])
  }
}
