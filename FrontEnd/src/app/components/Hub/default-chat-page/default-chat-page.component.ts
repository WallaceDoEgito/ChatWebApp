import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {UserInfoDTO} from "../../../DTOs/UserInfoDTO";
import {SignalConnectService} from "../../../services/SignalConnect/signal-connect.service";
import {UserMiniProfileComponent} from "./user-mini-profile/user-mini-profile.component";
import {MatIconButton} from "@angular/material/button";
import {Subscription} from "rxjs";
import {UserInfoService} from "../../../services/UserInfo/user-info.service";
import {GetProfilePicUrlFromUser} from "../../../services/ProfilePic/ProfilePicUrl";
import {FriendInfoDTO} from "../../../DTOs/FriendInfoDTO";

@Component({
    selector: 'app-default-chat-page',
    imports: [
        MatIconModule,
        MatBadgeModule,
        UserMiniProfileComponent,
        MatIconButton
    ],
    templateUrl: './default-chat-page.component.html',
    styleUrl: './default-chat-page.component.css'
})
export class DefaultChatPageComponent implements OnInit, OnDestroy {
    public SignalConnection = inject(SignalConnectService);
    public Solicitations: UserInfoDTO[] = [];
    public Friends: FriendInfoDTO[] = []
    public AddedFriendsSelected = true;
    public SolicitationsSelected = false;
    private NewFriendRequestSubs$!: Subscription
    private NewFriendSubs$!: Subscription

    userInfo = inject(UserInfoService)

    async ngOnInit(): Promise<void> {
        await this.SignalConnection.whenConnected();
        this.Solicitations = await this.SignalConnection.GetFriendRequests();
        this.Friends = await this.SignalConnection.GetFriends();
        this.NewFriendRequestSubs$ = this.SignalConnection.GetNewFriendRequestObservable$().subscribe(username => this.NewFriendRequest(username))
        this.NewFriendSubs$ = this.SignalConnection.GetNewFriendObservable$().subscribe(username => this.NewFriend(username))
        this.SignalConnection.GetFriendProfileChangeObservable().subscribe(user => this.OnFriendProfileChange(user))
    }

    ngOnDestroy(): void {
        if (this.NewFriendSubs$) this.NewFriendSubs$.unsubscribe();
        if (this.NewFriendRequestSubs$) this.NewFriendRequestSubs$.unsubscribe();
    }

    private OnFriendProfileChange(user:UserInfoDTO)
    {
        let index = this.Friends.findIndex((u) => u.userId === user.userId)
        this.Friends[index].userProfilePicUrl = user.userProfilePicUrl
        this.Friends[index].exibitedUsername = user.exibitedUsername
    }
    private async NewFriendRequest(username: String) {
        this.Solicitations = await this.SignalConnection.GetFriendRequests();
    }

    private async NewFriend(username: String) {
        this.Friends = await this.SignalConnection.GetFriends();
    }

    public SelectSolicitations() {
        this.SolicitationsSelected = true;
        this.AddedFriendsSelected = false;
    }

    public SelectAdded() {
        this.SolicitationsSelected = false;
        this.AddedFriendsSelected = true;
    }

    public async AnswerFriendRequest(UserIdToRespond: String, accepted: boolean) {
        await this.SignalConnection.FriendRequestResponse(UserIdToRespond, accepted);
        let indexArray = this.Solicitations.findIndex(s => s.userId == UserIdToRespond)
        this.Solicitations.splice(indexArray, 1);
    }

    protected readonly GetProfilePicUrlFromUser = GetProfilePicUrlFromUser;
}
