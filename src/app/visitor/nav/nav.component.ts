import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../shared/service/ws-chat.service';
import {AppService} from '../../shared/service/app.service';
import {Router} from '@angular/router';
@Component({
    selector: 'app-visitor-navbar',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.style.css']
})

export class VisitorNavComponent implements OnInit {
    public sessionUser = null;
    constructor(private chatService: ChatService,
                private appService: AppService,
                private router: Router) {
    }

    ngOnInit() {
        this.appService.sessionUser
            .subscribe(
                user => {
                    console.log('Navbar arrived new value');
                    console.dir(user);
                    this.sessionUser = user;
                }
            )
    }

    destroySession() {
        sessionStorage.removeItem('chatSessionUser');
        sessionStorage.removeItem('chatSessionId');
        this.sessionUser = null;
        this.appService.sessionUser.next(null);
        this.chatService.requestNewChatSession();
        this.chatService.tempUserRegistered.next(null);
        this.router.navigate(['/']);
    }
}