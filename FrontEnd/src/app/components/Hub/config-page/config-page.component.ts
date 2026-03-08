import {Component, inject, OnInit} from '@angular/core';
import {UserInfoService} from "../../../services/UserInfo/user-info.service";
import {GetProfilePicUrlFromUserConfig} from "../../../services/ProfilePic/ProfilePicUrl";
import {FormsModule} from "@angular/forms";
import {UserConfigInfoDTO} from "../../../DTOs/UserConfigInfoDTO";
import {MatButton} from "@angular/material/button";
import {BaseInputComponent} from "../../BaseComponents/base-input/base-input.component";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-config-page',
    templateUrl: './config-page.component.html',
    imports: [
        FormsModule,
        MatButton,
        BaseInputComponent,
        MatIcon
    ],
    styleUrl: './config-page.component.css'
})
export class ConfigPageComponent implements OnInit {
    UserService = inject(UserInfoService)
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
        console.log(event)
    }

    async OnSaveClick()
    {
        if(!this.IsEditValid()) return;
        this.UserService.UpdateUserConfig(this.UserEdit)
    }

    IsEditValid()
    {
        return true
    }
}
