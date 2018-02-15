import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';

import {VisitorHomeComponent} from './home/home.component';
import {VisitorNavComponent} from './nav/nav.component';
import {VisitorRoutingModule} from './routes';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

@NgModule({
    declarations: [
        VisitorHomeComponent,
        VisitorNavComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        NgbModule.forRoot(),
        VisitorRoutingModule
    ],
    providers: [
        //VisitorAuthGuard
    ],
    exports: [
        RouterModule,
        VisitorHomeComponent,
        VisitorNavComponent,
        LoginComponent,
        RegisterComponent
    ]
})

export class VisitorModule { }
