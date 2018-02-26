import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {AppService} from '../../shared/service/app.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChatService} from '../../shared/service/chat.service';
import {ChatWebSocketService} from '../../shared/service/ws-chat.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['home.style.css']
})

export class VisitorHomeComponent implements OnInit {
    public searchOptions: any = {
        zip: ''
    };
    public searchResult: any = null;
    public messageText: string = '';
    public modelRef: NgbModalRef;
    public user: any = {};
    public storageUser = null;
    public destinationUser: any = null;
    private chatWSUserIsConnected: boolean = false;

    constructor(private userService: UserService,
                private modalService: NgbModal,
                private router: Router,
                private appService: AppService,
                private chatService: ChatService,
                private chatWSService: ChatWebSocketService) {
    }

    ngOnInit() {
        this.subscribeUser();
        this.chatWSService.connected.subscribe(
            connected => {
                this.chatWSUserIsConnected = connected;
            }
        )
    }

    subscribeUser () {
        this.appService.user.subscribe(
            user => {
                this.storageUser = user;
                if (this.storageUser) {
                    this.user = this.storageUser;
                } else {
                    this.user = {};
                }
            }
        );
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
        this.destinationUser = user;
        this.modelRef = this.modalService.open(modalWindow);
    }

    sendMessage() {
        if (!this.storageUser) {
            this.userService.registerTemporaryUser(this.user)
                .subscribe(
                    response => {
                        if (response && response.user) {
                            if (this.chatWSUserIsConnected) {
                                this.createNewChatAndSendMessage(response.user, this.destinationUser);
                            }
                        }
                    }
                )
        } else {
            if (this.chatWSUserIsConnected) {
                this.createNewChatAndSendMessage(this.user, this.destinationUser);
            }
        }
    }


    createNewChatAndSendMessage(user, destUser) {
        let newChat = {
            participants: [
                user['_id'],
                destUser['_id']
            ],
            messages: []
        };

        this.chatService.createNewChat(newChat)
            .subscribe(
                chatResponse => {
                    console.dir(chatResponse);
                    if (chatResponse.chat) {
                        const chatId = chatResponse.chat['_id'];
                        const messageFrom = this.user['_id'];

                        const messageBody = {
                            chatId: chatId,
                            messageFrom: messageFrom,
                            messageText: this.messageText,
                            type: 'NEW_MESSAGE'
                        };
                        this.chatWSService.sendMessage(messageBody);
                        this.messageText = '';

                        if (this.modelRef) {
                            this.modelRef.close();
                            this.modelRef = null;
                        }
                    }
                },
                error => {
                    console.dir(error);
                }
            );
    }

}