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

  }

}
