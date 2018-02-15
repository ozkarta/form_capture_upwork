import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {BuyerNavComponent} from './nav/nav.component';
import {BuyerRoutingModule} from './routes';


@NgModule({
    declarations: [
        BuyerNavComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        NgbModule.forRoot(),
        BuyerRoutingModule
    ],
    providers: [
        //VisitorAuthGuard
    ],
    exports: [
        RouterModule,
        BuyerNavComponent
    ]
})

export class BuyerModule { }
