import {Component, inject, OnInit} from '@angular/core';
import {UserInfoService} from "../../../services/UserInfo/user-info.service";
import {GetProfilePicUrlFromUserConfig, isBase64} from "../../../services/ProfilePic/ProfilePicUrl";
import {FormsModule} from "@angular/forms";
import {UserConfigInfoDTO} from "../../../DTOs/UserConfigInfoDTO";
import {BaseInputComponent} from "../../BaseComponents/base-input/base-input.component";
import {MatIcon} from "@angular/material/icon";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {FileService} from "../../../services/File/file-service.service";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {SignalConnectService} from "../../../services/SignalConnect/signal-connect.service";
import {Router} from "@angular/router";
import {MatRipple} from "@angular/material/core";

@Component({
    selector: 'app-config-page',
    templateUrl: './config-page.component.html',
    imports: [
        FormsModule,
        BaseInputComponent,
        MatIcon,
        NgOptimizedImage,
        MatRipple
    ],
    styleUrl: './config-page.component.css'
})
export class ConfigPageComponent implements OnInit {
    UserService = inject(UserInfoService)
    private fileService = inject(FileService)
    private connectionService = inject(SignalConnectService)
    private router = inject(Router)
    LocalUser!: UserConfigInfoDTO
    UserEdit: UserConfigInfoDTO = {
        username: '',
        exibitedUsername: '',
        userProfilePicUrl: ''
    }

    HasChanges() {
        if (!this.LocalUser && !this.UserEdit) return false
        let editUserComparer = {...this.UserEdit}
        editUserComparer.exibitedUsername = editUserComparer.exibitedUsername.trim()
        editUserComparer.username = editUserComparer.username.trim()
        return JSON.stringify(this.LocalUser) !== JSON.stringify(editUserComparer)
    }

    async ngOnInit(): Promise<void> {
        this.LocalUser = await this.UserService.GetUserConfigInfo();
        this.LocalUser.userProfilePicUrl = GetProfilePicUrlFromUserConfig(this.LocalUser)
        this.UserEdit = {...this.LocalUser}
    }

    OnFileUpload(event: Event) {
        let inputEvent = event.target as HTMLInputElement
        let fileList = inputEvent?.files

        if (fileList == null) return;

        let file: File = fileList[0] as File
        this.fileService.UploadAvatar(file).subscribe({
            next: (event: HttpEvent<any>) => {
                switch (event.type)
                {
                    case HttpEventType.UploadProgress:
                        break;

                    case HttpEventType.Response:
                        this.UserEdit.userProfilePicUrl = event.body.url;
                        break;
                }
            },
            error: (error) => {

            }
        })
    }

    OnSaveClick()
    {
        if(!this.HasChanges() || !this.IsEditValid()) return;
        this.UserService.UpdateUserConfig(this.UserEdit).subscribe()
    }

    IsEditValid() {
        return true
    }

    async OnLogoutClick()
    {
        await this.connectionService.Disconnect();
        localStorage.clear();
        await this.router.navigate(["/auth"])
    }

    protected readonly isBase64 = isBase64;
}
