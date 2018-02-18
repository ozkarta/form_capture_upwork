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
    this.restoreWebSocketSession();
  }

  restoreWebSocketSession() {
    this.appService.isLoggedIn.subscribe(
        isLoggedIn => {
          if (!isLoggedIn) {
            console.log('Not Authenticated');
            let chatSession = sessionStorage.getItem('chatSessionId');
            if (!chatSession) {
                console.log('No Chat Session');
                this.chatService.connected.subscribe(
                    isConnected => {
                        if (isConnected) {
                            this.chatService.requestNewChatSession();
                        }
                    }
                );
            }
          }
        }
    )
  }
}
