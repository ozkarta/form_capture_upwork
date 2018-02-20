import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {WebSocketService} from './ws.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class ChatService {
    public ws: Subject<any>;
    public connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public sessionIdAssigned: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public tempUserRegistered: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public chatListRequestArrived: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private weService: WebSocketService, private http: HttpClient) {

        console.log('Creating web socket...');

        this.ws = <Subject<any>>this.weService.connect("ws://" + location.host)
            .map((response: MessageEvent): any => {
                let jsonData = JSON.parse(response.data);

                if (jsonData.type === 'handshake') {
                    console.log('HandShake arrived');
                    this.connected.next(true);
                }
                return jsonData;
            });

        this.subscribeChatServer();
    }

    subscribeChatServer() {

        this.ws.subscribe(
            successResponse => {
                console.dir(successResponse);
                if (successResponse && successResponse.type === 'NEW_SESSION_REQUEST' && successResponse.status === 200) {
                    sessionStorage.setItem('chatSessionId', successResponse.chatSession);
                    this.sessionIdAssigned.next(true);

                    console.log('this.sessionIdAssigned.next(true);')
                }

                if (successResponse && successResponse.type === 'REGISTER_TEMP_USER' && successResponse.status === 200) {
                    sessionStorage.setItem('chatSessionUser', JSON.stringify(successResponse.user));
                    this.tempUserRegistered.next(successResponse.user);
                    console.log('!!!!!!!!! this.tempUserRegistered.next(successResponse.user);');
                }

                if (successResponse && successResponse.type === 'CHAT_LIST_REQUEST') {
                    this.chatListRequestArrived.next(successResponse);
                }
            },
            error => {
                console.dir(error);
            }
        )
    }

    sendMessage(message: any) {
        this.ws.next(message);
    }

    requestNewChatSession() {
        console.log('Requesting new chat session');
        this.sendMessage({
            type: 'NEW_SESSION_REQUEST'
        });
    }

    registerTempUser(token, user) {
        console.log('Registering Temporary User');
        this.sendMessage({
           type: 'REGISTER_TEMP_USER',
           token:  token,
           user: user
        });
    }

    requestChatList(uid: string) {
        this.sendMessage({
            type: 'CHAT_LIST_REQUEST',
            user: uid
        });
    }
}