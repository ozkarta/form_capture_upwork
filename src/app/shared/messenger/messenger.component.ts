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
    public textMessage: string = '';
    public selectedChat: any = null;
    // chat with user
    public userId: string = null;
    // session user or registered user
    public user: any = null;
    public sessionUser: any = null;
    public registeredUser: any = null;
    public wsConnected: any = false;
    private chatServerWebSocketSubscription = null;
    private sessionUserSubscribed: boolean = false;
    private registeredUserSubscribed: boolean = false;

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

                this.sessionUserSubscribed = true;
                if (sessionUser) {
                    this.sessionUser = sessionUser;
                    this.getChatListTrigger.next(sessionUser);
                } else {
                    this.sessionUser = null;
                }
            }
        );

        this.appService.user.subscribe(
            buyer => {
                this.registeredUserSubscribed = true;
                if (buyer) {
                    this.registeredUser = buyer;
                    this.getChatListTrigger.next(buyer);
                } else {
                    this.registeredUser = null;
                }
            }
        );

        this.chatService.connected.subscribe(
            connected => {
                if (connected) {
                    console.log('Connected...');
                    this.wsConnected = connected;
                    this.getChatListTrigger.next(connected);
                } else {
                    this.wsConnected = false;
                }
            }
        );

        this.chatService.chatListRequestArrived.subscribe(
            successResponse => {
                if (!successResponse) {
                    return;
                }
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


    subscribeGetChatListTrigger() {
        this.getChatListTrigger.subscribe(val => {

            console.log('Triggered');

            if (this.registeredUserSubscribed && this.sessionUserSubscribed) {
                this.user = this.sessionUser || this.registeredUser;
                if (!this.user) {
                    this.router.navigate(['/']);
                }
            }
            if (this.wsConnected && this.user) {
                console.log('Requesting chat list');
                this.chatService.requestChatList(this.user['_id']);
            } else {
                this.chats = [];
            }
        });
    }

    getDestinationUserName(chat) {
        let user = this.getChatUserNot(chat, this.user['_id']);
        switch (user.type){
            case 'regular':
                return `${user.user['firstName']} ${user.user['lastName']}`;
            case 'temporary':
                return `${user.user['name']} (${user.user['phone']})`;
        }
    }

    getChatUserNot(chat, myUid) {

        for (let i=0; i<chat.users.length; i++) {

            if (chat.users[i].user && !(chat.users[i].user['_id'] === myUid)) {
                return chat.users[i];
            }
        }
    }

    getChatUser(chat, uid) {

        for (let i=0; i<chat.users.length; i++) {

            if (chat.users[i].user && (chat.users[i].user['_id'] === uid)) {
                return chat.users[i];
            }
        }
    }

    getChatUserNameById(chat, id) {
        let user = this.getChatUser(chat, id);
        switch (user.type) {
            case 'regular':
                return `${user.user['firstName']} ${user.user['lastName']}`;
            case 'temporary':
                return `${user.user['name']} (${user.user['phone']})`;
        }
    }
    
    sendMessage(chat) {
        //let destUser = this.getDestinationUser(chat);
        console.log(this.textMessage);

        this.textMessage = '';
    }
}