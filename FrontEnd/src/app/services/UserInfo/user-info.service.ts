import {inject, Injectable} from '@angular/core';
import {SignalConnectService} from "../SignalConnect/signal-connect.service";
import {UserInfoDTO} from "../../DTOs/UserInfoDTO";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private signalRConnection = inject(SignalConnectService);
  private currentUserInfo!:UserInfoDTO

  async LoadUser()
  {
    if(this.currentUserInfo === undefined)
    {
      this.currentUserInfo = await this.signalRConnection.GetCurrentUserInfoAsync()
    }
  }

  GetUserInfo()
  {
    return this.currentUserInfo;
  }
}
