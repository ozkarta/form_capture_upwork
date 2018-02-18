import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {WebSocketService} from './ws.service';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class ChatService {
    public ws: Subject<any>;

    constructor(private weService: WebSocketService, private http: HttpClient) {

        console.log('Creating web socket...');

        this.ws = <Subject<any>>this.weService.connect("ws://" + location.host)
            .map((response: MessageEvent): any => {

                return JSON.parse(response.data);
            });
    }

    sendMessage(message: any) {
        this.ws.next(message);
    }
}