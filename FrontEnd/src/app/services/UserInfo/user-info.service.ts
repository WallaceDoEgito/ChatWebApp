import {inject, Injectable} from '@angular/core';
import {SignalConnectService} from "../SignalConnect/signal-connect.service";
import {UserInfoDTO} from "../../DTOs/UserInfoDTO";
import {BehaviorSubject, firstValueFrom, tap} from "rxjs";
import {UserConfigInfoDTO} from "../../DTOs/UserConfigInfoDTO";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../enviroments/enviroment";

@Injectable({
    providedIn: 'root'
})
export class UserInfoService {
    private signalRConnection = inject(SignalConnectService);
    private httpClient = inject(HttpClient)
    private currentUserInfo!: UserInfoDTO
    private currentUserConfig!: UserConfigInfoDTO
    private UserConfigChangedSubject = new BehaviorSubject<UserConfigInfoDTO>(this.currentUserConfig);
    private UserChangedSubject = new BehaviorSubject<UserInfoDTO>(this.currentUserInfo)

    GetUserConfigChanged$() {
        return this.UserConfigChangedSubject.asObservable()
    }

    GetUserChanged$() {
        return this.UserChangedSubject.asObservable()
    }

    private NotifyUserChanged(user: UserInfoDTO) {
        this.UserChangedSubject.next(user);
    }

    private NotifyUserConfigChanged(user: UserConfigInfoDTO) {
        this.UserConfigChangedSubject.next(user);
    }

    async GetUserInfo() {
        await firstValueFrom(this.signalRConnection.IsConnected$());
        if (this.currentUserInfo == null) {
            this.currentUserInfo = await this.signalRConnection.GetCurrentUserInfoAsync();
            this.NotifyUserChanged(this.currentUserInfo)
        }
        return this.currentUserInfo;
    }

    async GetUserConfigInfo() {
        await firstValueFrom(this.signalRConnection.IsConnected$());
        if (this.currentUserConfig == null) {
            this.currentUserConfig = await this.signalRConnection.GetCurrentUserConfigInfoAsync()
            this.NotifyUserConfigChanged(this.currentUserConfig)
        }
        return this.currentUserConfig;

    }

    UpdateUserConfig(newUser: UserConfigInfoDTO) {
        let jwtToken = localStorage.getItem("JWTSession") ?? ""
        let header = new HttpHeaders({
            'Authorization': `Bearer ${jwtToken}`
        })
        return this.httpClient.put(`${environment.apiUrl}/api/user`, newUser, {headers: header}).pipe(
            tap({
                next: (updatedUser) => {
                    this.NotifyUserConfigChanged(updatedUser as UserConfigInfoDTO)
                    this.currentUserConfig = updatedUser as UserConfigInfoDTO
                },
                error: (err) => console.log("Erro na atualização de usuario: ", err)
            })
        )
    }
}
