import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {BuyerNavComponent} from './nav/nav.component';
import {BuyerRoutingModule} from './routes';
import {BuyerHomeComponent} from './home/home.component';
import {BuyerAuthGuard} from './buyer-auth.guard';


@NgModule({
    declarations: [
        BuyerNavComponent,
        BuyerHomeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        NgbModule.forRoot(),
        BuyerRoutingModule
    ],
    providers: [
        BuyerAuthGuard
    ],
    exports: [
        RouterModule,
        BuyerNavComponent,
        BuyerHomeComponent
    ]
})

export class BuyerModule { }
