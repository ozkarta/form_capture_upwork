import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BusyModule} from 'angular2-busy';

import {AppComponent} from './app.component';
import {VisitorModule} from './visitor/visitor.module';
import {MainNavComponent} from './shared/nav/nav.component';

import {AppService} from './shared/service/app.service';
import {UserService} from './shared/service/user.service';
import {BuyerModule} from './buyer/buyer.module';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent
  ],
  imports: [
    BrowserModule,
      FormsModule,
      CommonModule,
      BusyModule,
      NgbModule.forRoot(),

      VisitorModule,
      BuyerModule
  ],
  providers: [
      AppService,
      UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
