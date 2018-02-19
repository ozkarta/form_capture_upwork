import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../shared/service/ws-chat.service';
import {AppService} from '../../shared/service/app.service';
@Component({
    selector: 'app-visitor-navbar',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.style.css']
})

export class VisitorNavComponent implements OnInit {
    public sessionUser = null;
    constructor(private chatService: ChatService,
                private appService: AppService) {
    }

    ngOnInit() {
        this.appService.sessionUser
            .subscribe(
                user => {
                    this.sessionUser = user;
                }
            )
    }

    destroySession() {
        sessionStorage.removeItem('chatSessionUser');
        sessionStorage.removeItem('chatSessionId');
        this.sessionUser = null;
        this.chatService.requestNewChatSession();
        this.appService.sessionUser.next(null);
    }
}