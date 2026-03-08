import {Component, inject, OnInit, output} from '@angular/core';
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {UserInfoService} from "../../../../services/UserInfo/user-info.service";
import {GetProfilePicUrlFromUser, GetProfilePicUrlFromUserConfig} from "../../../../services/ProfilePic/ProfilePicUrl";
import {Router} from "@angular/router";
import {UserConfigInfoDTO} from "../../../../DTOs/UserConfigInfoDTO";

@Component({
    selector: 'app-user-profile',
    imports: [
        MatIconButton,
        MatIcon,
    ],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
    currentUser = inject(UserInfoService)
    user!: UserConfigInfoDTO
    router = inject(Router)
    ConfigButtonClicked = output()

    async ngOnInit() {
        this.user = await this.currentUser.GetUserConfigInfo()
        this.currentUser.GetUserConfigChanged$().subscribe((newValue) => this.user = newValue)
    }

    async OnConfigClick() {
        this.ConfigButtonClicked.emit();
        await this.router.navigate(["hub", "config"]);
    }

    protected readonly GetProfilePicUrlFromUser = GetProfilePicUrlFromUser;
    protected readonly GetProfilePicUrlFromUserConfig = GetProfilePicUrlFromUserConfig;
}
