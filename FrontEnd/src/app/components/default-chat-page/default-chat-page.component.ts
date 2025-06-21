import {AfterViewInit, Component, inject, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {UserInfoDTO} from "../../DTOs/UserInfoDTO";
import {SignalConnectService} from "../../services/SignalConnect/signal-connect.service";
import {UserMiniProfileComponent} from "../user-mini-profile/user-mini-profile.component";
import {MatIconButton} from "@angular/material/button";
import {Subscription} from "rxjs";

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
export class DefaultChatPageComponent implements OnInit, OnDestroy{
  public SignalConnection = inject(SignalConnectService);
  public Solicitations:UserInfoDTO[] = [];
  public Friends:UserInfoDTO[] = []
  public AddedFriendsSelected = true;
  public SolicitationsSelected = false;
  public NewFriendRequestEvent$ : any;
  public NewFriendAcceptedEvent$ : any;
  public base64WhiteImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
  private NewFriendRequestSubs$! : Subscription
  private NewFriendSubs$! : Subscription

  async ngOnInit(): Promise<void> {
    this.SignalConnection.IsConnected$().subscribe(async() =>
    {
        this.Solicitations =  await this.SignalConnection.GetFriendRequests();
        this.Friends = await this.SignalConnection.GetFriends();
        this.NewFriendRequestSubs$ = this.SignalConnection.GetNewFriendRequestObservable$().subscribe(username => this.NewFriendRequest(username))
        this.NewFriendSubs$ = this.SignalConnection.GetNewFriendObservable$().subscribe(username => this.NewFriend(username))
    })
  }

  ngOnDestroy(): void {
      this.NewFriendSubs$.unsubscribe();
      this.NewFriendRequestSubs$.unsubscribe();
  }

  private async NewFriendRequest(username:String)
  {
    console.log(username)
    this.Solicitations = await this.SignalConnection.GetFriendRequests();
  }

  private async NewFriend(username:String)
  {
    console.log(username)
    this.Friends = await this.SignalConnection.GetFriends();
  }

  public SelectSolicitations()
  {
    this.SolicitationsSelected = true;
    this.AddedFriendsSelected = false;
  }

  public SelectAdded()
  {
    this.SolicitationsSelected = false;
    this.AddedFriendsSelected = true;
  }

  public async AnswerFriendRequest(UserIdToRespond:String, accepted :boolean)
  {
    await this.SignalConnection.FriendRequestResponse(UserIdToRespond, accepted);
    let indexArray = this.Solicitations.findIndex( s => s.userId == UserIdToRespond)
    this.Solicitations.splice(indexArray, 1);
  }
}
