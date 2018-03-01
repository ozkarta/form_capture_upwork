import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {AdminNavComponent} from './nav/nav.component';
import {AdminRoutingModule} from './routes';
import {AdminAuthGuard} from './admin-auth.guard';
import {AdminHomeComponent} from './home/home.component';


@NgModule({
    declarations: [
        AdminHomeComponent,
        AdminNavComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        NgbModule.forRoot(),
        AdminRoutingModule
    ],
    providers: [
        AdminAuthGuard
    ],
    exports: [
        RouterModule,
        AdminNavComponent,
        AdminHomeComponent
    ]
})

export class AdminModule { }
