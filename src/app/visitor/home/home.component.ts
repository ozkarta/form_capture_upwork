import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {AppService} from '../../shared/service/app.service';
import {ChatService} from '../../shared/service/ws-chat.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['home.style.css']
})

export class VisitorHomeComponent implements OnInit {
    public searchOptions: any = {
        zip: ''
    };
    public message: string = '';
    public sender: any = {};

    public activeUser = null;
    public searchResult: any = null;
    public sessionUser: any = null;
    public sendMessageReadyState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public modelRef: NgbModalRef;
    public messageToSend = null;

    constructor(private userService: UserService,
                private modalService: NgbModal,
                private router: Router,
                private appService: AppService,
                private chatService: ChatService) {
    }

    ngOnInit() {
        this.appService.sessionUser
            .subscribe(
                user => {
                    this.sessionUser = user;
                }
            );

        this.subscribeChatTempUserRegisteredResponse();
    }

    search() {
        this.userService.getUsersBySearchOptions(this.searchOptions)
            .subscribe(
                users => {
                    this.searchResult = users;
                },
                errorResponse => {
                    console.dir(errorResponse);
                }
            )
    }

    openNewMessageModal(modalWindow, user) {
        if (this.sessionUser) {
            this.router.navigate(['chat', user['_id']]);
            return;
        }
        this.activeUser = user;
        this.modelRef = this.modalService.open(modalWindow);
    }

    sendMessage() {
        console.log('Sending Message...');
        console.dir(this.sender);
        let chatSession = sessionStorage.getItem('chatSessionId');
        this.chatService.registerTempUser(chatSession, this.sender);
        this.messageToSend = {

        }
    }


    subscribeChatTempUserRegisteredResponse() {
        this.chatService.tempUserRegistered.subscribe(
            user => {
                if (user) {
                    this.appService.sessionUser.next(user);
                    if (this.messageToSend) {
                        console.log('Ready to send message...');
                        // Send Message
                        this.messageToSend = null;
                        if (this.modelRef) {
                            this.modelRef.close();
                            this.modelRef = null;
                        }
                    }
                }
            }
        )
    }
}