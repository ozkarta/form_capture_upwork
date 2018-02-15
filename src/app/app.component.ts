import {Component, OnInit} from '@angular/core';
import {AppService} from './shared/service/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(public appService: AppService) {
  }

  ngOnInit() {
  }

}
