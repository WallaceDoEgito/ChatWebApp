import {Component, input} from '@angular/core';
import {BrazilianDatePipePipe} from "../../pipes/brazilian-date-pipe.pipe";
import {DatePipe} from "@angular/common";
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {MessageDTO} from "../../DTOs/MessageDTO";
import {MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenu, MatMenuModule, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-message',
    imports: [
        BrazilianDatePipePipe,
        DatePipe,
        MatIconButton,
        MatIconModule,
        MatMenuTrigger,
        MatMenuModule,
    ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
    ChannelSelected = input.required<ChannelDTO>()
    MessageToRender = input.required<MessageDTO>()
    IndexMessage = input.required<Number>()
    WhiteImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
    MenuIsOpen = false;
    IsEditing = false;

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
        console.log("Delete Todo")
        console.log("Going to delete the message: " + this.MessageToRender().messageContent)
    }

    EditMessage()
    {
        console.log("Edit Todo")
    }

    FirstMessageOrDifferentUser()
    {
        let isFirstMessage = this.IndexMessage().valueOf() === this.ChannelSelected().Messages.length - 1
        if(isFirstMessage) return true;
        let lastMessageWasFromADiferentUserChannelSelected = this.ChannelSelected().Messages[this.IndexMessage().valueOf() + 1].userIdThatSended != this.MessageToRender().userIdThatSended
        return isFirstMessage || lastMessageWasFromADiferentUserChannelSelected;
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
}
