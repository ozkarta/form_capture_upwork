import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatWebSocketService} from '../service/ws-chat.service';
import {ChatService} from '../service/chat.service';
import {AppService} from '../service/app.service';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-messenger-component',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.style.css']
})

export class MessengerComponent implements OnInit, AfterViewChecked {
  public user: any = null;
  public chats: any[] = [];
  public wsUserConnected: boolean = false;
  public activeChat: any = null;
  @ViewChild('scrollable') private myScrollContainer: ElementRef;


  public messageText: String = '';
  constructor(private chatWSService: ChatWebSocketService,
              private chatService: ChatService,
              private appService: AppService,
              private userService: UserService,
              private router: Router) {

  }

  ngOnInit() {

    this.appService.user.subscribe(
      user => {
        if (!user) {
          this.router.navigate(['/']);
        }
        this.user = user;
        if (this.user) {
          this.chatService.getChatListForUser(this.user['_id'])
            .subscribe(
              res => {
                if (res.chats) {
                  this.chats = res.chats;
                  if (this.chats.length) {
                    this.activeChat = this.chats[0];
                  }
                }
              },
              error => {
                console.dir(error);
              }
            );
        }
      }
    );

    this.chatWSService.connected.subscribe(
      connected => {
        this.wsUserConnected = connected;
      }
    );

    this.chatWSService.newMessage.subscribe(
      response => {
        this.chats.forEach(chat => {
          if (chat['_id'] === response.chatId) {
            chat.messages.push(response.message);
            //this.scrollToBottom();
          }
        });
      }
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getChatTitle(chat) {
    let result = '';

    chat.participants.forEach(participant => {
      if (participant && participant['_id'] !== this.user['_id']) {
        result += `${participant['firstName']} ${participant['lastName']}, `;
      }
    });

    result = result.substr(0, result.length - 2);
    return result;
  }


  sendMessage() {
    if (this.wsUserConnected) {
      console.log('Sending message...');
      const chatId = this.activeChat['_id'];
      const messageFrom = this.user['_id'];

      const messageBody = {
        chatId: chatId,
        messageFrom: messageFrom,
        messageText: this.messageText,
        type: 'NEW_MESSAGE'
      };
      this.chatWSService.sendMessage(messageBody);
      this.messageText = '';
    } else {
      console.log('WS user is not connected');
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getSenderName(chat, message): string {
    let result = '';
    chat.participants.forEach(participant => {
      if (participant['_id'] === message.sender) {
          result = `${participant['firstName']} ${participant['lastName']}`;
          if (participant['role'] === 'temporary') {
            result += ` (${participant['phone']})`;
          }
      }
    });
    return result;
  }
}
