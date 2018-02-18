import {Component, OnInit} from '@angular/core';
import {ChatService} from '../service/ws-chat.service';
@Component({
    templateUrl: './messenger.component.html',
    styleUrls: ['./messenger.style.css']
})

export class MessengerComponent implements OnInit {
    public selectedChat: any = null;

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.chatService.ws.subscribe(
            success => {
                console.dir(success);
            },
            error => {
                console.log(error);
            }
        )

    }
}