import {Component, inject, input, OnChanges, output} from '@angular/core';
import {BrazilianDatePipePipe} from "../../pipes/brazilian-date-pipe.pipe";
import {DatePipe} from "@angular/common";
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {MessageDTO} from "../../DTOs/MessageDTO";
import {MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {FormsModule} from "@angular/forms";
import {AutomaticFocusDirective} from "../../Directives/automatic-focus.directive";
import {UserInfoService} from "../../services/UserInfo/user-info.service";
import {GetProfilePicUrlFromUser} from "../../services/ProfilePic/ProfilePicUrl";

@Component({
  selector: 'app-message',
    imports: [
        BrazilianDatePipePipe,
        DatePipe,
        MatIconButton,
        MatIconModule,
        MatMenuTrigger,
        MatMenuModule,
        FormsModule,
        AutomaticFocusDirective,
    ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnChanges{
    ChannelSelected = input.required<ChannelDTO>()
    MessageToRender = input.required<MessageDTO>()
    IndexMessage = input.required<Number>()
    IsEditing = input.required<boolean>();

    MenuIsOpen = false;
    EditMessageModel:string = "";

    EditingMessageEvent = output<string>()
    NoMoreEditingEvent = output<string>()
    EditedMessageEvent = output<MessageDTO>()
    DeleteMessageEvent = output<string>()

    userInfo = inject(UserInfoService);

    MessageUserPhoto!:string

    ngOnChanges()
    {
        this.MessageUserPhoto = GetProfilePicUrlFromUser(this.MessageToRender().userThatSended)
    }

    IsOtherDay(isoStringOne:string, isoStringTwo:string): boolean
    {
        let DateOne = new Date(isoStringOne);
        let DateTwo = new Date(isoStringTwo);
        return DateOne.getDate() != DateTwo.getDate();
    }

    MenuOpenned()
    {
        this.MenuIsOpen = true;
    }
    MenuClosed()
    {
        this.MenuIsOpen = false;
    }

    DeleteMessage()
    {
        this.DeleteMessageEvent.emit(this.MessageToRender().messageId);
    }

    EditMessage()
    {
        this.EditingMessageEvent.emit(this.MessageToRender().messageId)
        this.EditMessageModel = this.MessageToRender().messageContent
    }

    CancelEdit()
    {
        this.NoMoreEditingEvent.emit(this.MessageToRender().messageId)
    }

    EditConfirmed()
    {
        this.EditedMessageEvent.emit(
            {
                messageId: this.MessageToRender().messageId,
                userThatSended: this.MessageToRender().userThatSended,
                channelId: this.MessageToRender().channelId,
                messageContent: this.EditMessageModel,
                sendAt: this.MessageToRender().sendAt,
                edited: true
            });
    }

    FirstMessageOrDifferentUser()
    {
        let isFirstMessage = this.IndexMessage().valueOf() === this.ChannelSelected().Messages.length - 1
        if(isFirstMessage) return true;
        let lastMessageWasFromADifferentUserChannelSelected = this.ChannelSelected().Messages[this.IndexMessage().valueOf() + 1].userThatSended.userId != this.MessageToRender().userThatSended.userId
        return isFirstMessage || lastMessageWasFromADifferentUserChannelSelected;
    }

    FirstMessageOrDifferentDate()
    {
        let isFirstMessage = this.IndexMessage().valueOf() === this.ChannelSelected().Messages.length - 1;
        if(isFirstMessage) return true;
        let lastMessageWasOtherDay = this.IsOtherDay(this.MessageToRender().sendAt, this.ChannelSelected().Messages[this.IndexMessage().valueOf()+1].sendAt)
        return isFirstMessage || lastMessageWasOtherDay
    }

    FirstMessageOrLastMessageWasTooLongAgo()
    {
        return this.FirstMessageOrDifferentDate() || this.FirstMessageOrDifferentUser()
    }

    CanThisUserEraseMessages() : boolean
    {
        let user = this.userInfo.GetUserInfo()
        if(user.userId == this.MessageToRender().userThatSended.userId) return true;
        return false;
    }
}
