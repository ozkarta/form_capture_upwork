import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ChatService} from '../../shared/service/chat.service';
import {AppService} from '../../shared/service/app.service';
@Component({
    selector: 'app-visitor-navbar',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.style.css']
})

export class VisitorNavComponent implements OnInit {
    public user = null;
    constructor(private chatService: ChatService,
                private appService: AppService,
                private router: Router) {
    }

    ngOnInit() {
        this.appService.user
            .subscribe(
                user => {
                    this.user = user;
                }
            )
    }

    destroySession() {

    }
}