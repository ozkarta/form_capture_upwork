import {Component, OnInit} from '@angular/core';
import {ChatService} from '../service/ws-chat.service';
@Component({
    templateUrl: './messenger.component.html',
    styleUrls: ['./messenger.style.css']
})

export class MessengerComponent implements OnInit {
    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
    }
}