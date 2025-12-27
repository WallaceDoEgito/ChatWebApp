import {Component, inject, OnInit, output} from '@angular/core';
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {UserInfoService} from "../../../../services/UserInfo/user-info.service";
import {UserInfoDTO} from "../../../../DTOs/UserInfoDTO";
import {GetProfilePicUrlFromUser} from "../../../../services/ProfilePic/ProfilePicUrl";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-user-profile',
  imports: [
    MatIconButton,
    MatIcon,
    AsyncPipe,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent{
  currentUser = inject(UserInfoService)
  user$!:Observable<UserInfoDTO>
  profileImageUrl!:string
  ConfigButtonClicked = output()

constructor()
  {
    this.user$ = this.currentUser.GetUserLoaded$()
  }

  OnConfigClick()
  {
    this.ConfigButtonClicked.emit();
  }

  protected readonly GetProfilePicUrlFromUser = GetProfilePicUrlFromUser;
}
