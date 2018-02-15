import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AppService} from '../service/app.service';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.style.css']
})
export class MainNavComponent implements OnInit {
  public user: any;
  constructor(private titleService: Title,
              public appService: AppService) {
    console.log('Nav Constructor...');
  }

  ngOnInit() {
    this.titleService.setTitle('Form Capture App');
    this.appService.user
      .subscribe((user: any) => {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        this.user = user;
        console.dir(this.user);
      });
  }
}
