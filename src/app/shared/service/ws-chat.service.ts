import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {WebSocketService} from './ws.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class ChatService {
    public ws: Subject<any>;
    public connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
    }

    sendMessage(message: any) {
        this.ws.next(message);
    }
}