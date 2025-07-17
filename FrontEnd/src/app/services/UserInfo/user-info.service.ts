import {inject, Injectable} from '@angular/core';
import {SignalConnectService} from "../SignalConnect/signal-connect.service";
import {UserInfoDTO} from "../../DTOs/UserInfoDTO";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private signalRConnection = inject(SignalConnectService);
  private currentUserInfo!:UserInfoDTO
  private UserLoadedSubject = new ReplaySubject<UserInfoDTO>(1);

  GetUserLoaded$()
  {
    return this.UserLoadedSubject.asObservable()
  }

  private NotifyUserLoaded(user: UserInfoDTO)
  {
    this.UserLoadedSubject.next(user);
  }

  async LoadUser()
  {
    if(this.currentUserInfo === undefined)
    {
      this.currentUserInfo = await this.signalRConnection.GetCurrentUserInfoAsync()
      this.NotifyUserLoaded(this.currentUserInfo)
    }
  }

  GetUserInfo()
  {
    return this.currentUserInfo;
  }
}
