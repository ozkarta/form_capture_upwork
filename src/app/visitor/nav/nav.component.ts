import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../shared/service/ws-chat.service';
@Component({
    selector: 'app-visitor-navbar',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.style.css']
})

export class VisitorNavComponent implements OnInit {
    public sessionUser = null;
    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        let user = sessionStorage.getItem('chatSessionUser');
        if (user) {
            this.sessionUser = JSON.parse(user);
        }
    }

    destroySession() {
        sessionStorage.removeItem('chatSessionUser');
        sessionStorage.removeItem('chatSessionId');
        this.sessionUser = null;
        this.chatService.requestNewChatSession();
    }
}