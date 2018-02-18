import {Component, OnInit} from '@angular/core';
import {AppService} from './shared/service/app.service';
import {ChatService} from './shared/service/ws-chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(public appService: AppService,
              private chatService: ChatService) {
  }

  ngOnInit() {
    this.subscribeChatServer();
    this.restoreWebSocketSession();
  }

  restoreWebSocketSession() {
    this.appService.isLoggedIn.subscribe(
        isLoggedIn => {
          if (!isLoggedIn) {
            console.log('Not Authenticated');
            let chatSession = sessionStorage.getItem('chatSession');
            if (!chatSession) {
                console.log('No Chat Session');
                this.chatService.connected.subscribe(
                    isConnected => {
                        if (isConnected) {
                            this.requestNewChatSession();
                        }
                    }
                );
            }
          }
        }
    )
  }

  requestNewChatSession() {
    console.log('Requesting new chat session');
    this.chatService.sendMessage({
        type: 'NEW_SESSION_REQUEST'
    });
  }

  subscribeChatServer() {

    this.chatService.ws.subscribe(
        successResponse => {
          //console.dir(success);
            if (successResponse && successResponse.type === 'NEW_SESSION_REQUEST') {
                sessionStorage.setItem('chatSession', successResponse.chatSession);
            }
        },
        error => {
          console.dir(error);
        }
    )
  }

}
