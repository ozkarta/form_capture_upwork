import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from '../service/ws-chat.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AppService} from '../service/app.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Component({
    templateUrl: './messenger.component.html',
    styleUrls: ['./messenger.style.css']
})

export class MessengerComponent implements OnInit, OnDestroy {
    public selectedChat: any = null;
    // chat with user
    public userId: string = null;
    // session user or registered user
    public user: any = null;
    public sessionUser: any = null;
    public registeredUser: any = null;
    public wsConnected: any = false;
    private chatServerWebSocketSubscription = null;

    public chats: any[] = [];

    public getChatListTrigger: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private chatService: ChatService,
                private activeRoute:ActivatedRoute,
                private appService: AppService,
                private router: Router) {

    }

    ngOnInit() {
        // console.log('On Init');
        this.subscribeUrlParams();
        //this.subscribeChatServerWebSocket();
        this.subscribeGetChatListTrigger();
        //
        this.appService.sessionUser.subscribe(
            sessionUser => {
                    this.sessionUser = sessionUser;
                    this.getChatListTrigger.next(sessionUser);

            }
        );

        this.chatService.connected.subscribe(
            connected => {
                if (connected) {
                    console.log('Connected...');
                    this.wsConnected = connected;
                    this.getChatListTrigger.next(connected);
                }
            }
        );

        this.appService.user.subscribe(
            buyer => {
                if (buyer) {
                    this.registeredUser = buyer;
                    this.getChatListTrigger.next(buyer);
                }
            }
        )

        this.chatService.chatListRequestArrived.subscribe(
            successResponse => {
                this.chats = successResponse.chats;
                // If user ID is not  passed then select first and  return
                if (!this.userId) {
                    if (this.chats.length) {
                        this.selectedChat = this.chats[0];
                    }
                    return;
                }
                this.chats.forEach(chat => {
                    chat.users.forEach(user => {
                        if (user['_id'] === this.userId) {
                            this.selectedChat = chat;
                        }
                    })
                });

                if (!this.selectedChat) {
                    // TODO create new chat history
                }
            }
        )
    }

    ngOnDestroy() {
        if (this.chatServerWebSocketSubscription) {
            this.chatServerWebSocketSubscription.unsubscribe();
            this.chatServerWebSocketSubscription = null;
        }
    }

    subscribeUrlParams() {
        this.activeRoute.params.subscribe(params => {
            this.userId = params['id'];
            console.log(this.userId);
        });
    }

    // subscribeChatServerWebSocket() {
    //     console.log('Subscribing web socket...');
    //     this.chatServerWebSocketSubscription = this.chatService.ws.subscribe(
    //         successResponse => {
    //             if (successResponse && successResponse.type === 'CHAT_LIST_REQUEST') {
    //                 this.chats = successResponse.chats;
    //                 // If user ID is not  passed then select first and  return
    //                 if (!this.userId) {
    //                     if (this.chats.length) {
    //                         this.selectedChat = this.chats[0];
    //                     }
    //                     return;
    //                 }
    //                 this.chats.forEach(chat => {
    //                     chat.users.forEach(user => {
    //                         if (user['_id'] === this.userId) {
    //                             this.selectedChat = chat;
    //                         }
    //                     })
    //                 });
    //
    //                 if (!this.selectedChat) {
    //                     // TODO create new chat history
    //                 }
    //             }
    //         },
    //         error => {
    //             console.log(error);
    //         }
    //     )
    // }

    subscribeGetChatListTrigger() {
        this.getChatListTrigger.subscribe(val => {

            console.log('Triggered');
            if (this.wsConnected && (this.sessionUser || this.registeredUser)) {
                this.user = this.sessionUser || this.registeredUser;
                console.log('Requesting chat list');
                this.chatService.requestChatList(this.user['_id']);
            }
        })
    }

    getDestinationUser(chat) {
        console.dir(chat);

        for (let i=0; i<chat.users.length; i++) {

            if (chat.users[i].user && !(chat.users[i].user['_id'] === this.user['_id'])) {
                console.log(chat.users[i].user['_id'] + ' VS ' + this.user['_id'])
                switch (chat.users[i].type){
                    case 'regular':
                        return `${chat.users[i].user['firstName']} ${chat.users[i].user['lastName']}`;
                    case 'temporary':
                        return `${chat.users[i].user['name']} (${chat.users[i].user['phone']})`;
                }
            }
        }
    }
}