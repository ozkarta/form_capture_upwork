import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {WebSocketService} from './ws.service';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class ChatService {
    public ws: Subject<any>;
    public connected: boolean = false;


    constructor(private weService: WebSocketService, private http: HttpClient) {

        console.log('Creating web socket...');

        this.ws = <Subject<any>>this.weService.connect("ws://" + location.host)
            .map((response: MessageEvent): any => {

                this.connected = true;

                let serverResponseJSON = JSON.parse(response.data);
                console.log('data received');
                console.dir(serverResponseJSON);
                // Check if  server responded correctly with JSON
                if (!serverResponseJSON) {
                    return null;
                }

                if (serverResponseJSON.type === 'handshake') {
                    return  {type: 'handshake'};
                }

                if (serverResponseJSON.type === 'GET') {
                    return serverResponseJSON;
                }

                if (serverResponseJSON.type === 'UpdateMessage'){
                    return serverResponseJSON;
                }

            });
    }
}