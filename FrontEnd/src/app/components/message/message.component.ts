import {Component, input} from '@angular/core';
import {BrazilianDatePipePipe} from "../../pipes/brazilian-date-pipe.pipe";
import {DatePipe} from "@angular/common";
import {ChannelDTO} from "../../DTOs/ChannelDTO";
import {MessageDTO} from "../../DTOs/MessageDTO";

@Component({
  selector: 'app-message',
    imports: [
        BrazilianDatePipePipe,
        DatePipe
    ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
    ChannelSelected = input.required<ChannelDTO>()
    MessageToRender = input.required<MessageDTO>()
    IndexMessage = input.required<Number>()
    WhiteImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="

    CompareDates(isoStringOne:string, isoStringTwo:string): boolean
    {
        let DateOne = new Date(isoStringOne);
        let DateTwo = new Date(isoStringTwo);

        console.log(`Comparando: ${isoStringOne} com ${isoStringTwo}`)
        console.log(`Uma possui dia: ${DateOne.getDate()} e a outra ${DateTwo.getDate()}`)
        return DateOne.getDate() != DateTwo.getDate();
    }
}
