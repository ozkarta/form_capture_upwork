import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {WebSocketService} from './ws.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UserService} from './user.service';
import {AppService} from './app.service';


@Injectable()
export class ChatWebSocketService {
  public ws: Subject<any>;
  public connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public newMessage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private user: any = null;

  constructor(private weService: WebSocketService,
              private userService: UserService,
              private appService: AppService) {
    this.appService.user.subscribe(
      user => {
        this.user = user;
        if (this.user) {
          this.createWSConnectionAndSubscribe();
        }
      }
    );
  }

  createWSConnectionAndSubscribe() {
    console.log('Creating web socket...');

    this.ws = <Subject<any>>this.weService.connect('ws://' + location.host)
      .map((response: MessageEvent): any => {
        const jsonData = JSON.parse(response.data);
        return jsonData;
      });
    this.subscribeChatServer();
  }

  subscribeChatServer() {

    this.ws.subscribe(
      successResponse => {
        console.dir(successResponse);

        if (successResponse.type === 'INIT_SESSION') {
          this.sendMessage({
            type: 'REGISTER_WS_USER',
            sessionId: successResponse.sessionId,
            userId: this.user['_id']
          });
        }

        if (successResponse.type === 'REGISTER_WS_USER' && successResponse.status === 200) {
          this.connected.next(true);
        }

        if (successResponse.type === 'NEW_MESSAGE' && successResponse.status === 200) {
          this.newMessage.next(successResponse);
        }
      },
      error => {
        console.dir(error);
      },
      () => {
        console.log('Closed');
      }
    );
  }

  sendMessage(message: any) {
    this.ws.next(message);
  }
}