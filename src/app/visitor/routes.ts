import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {VisitorHomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {MessengerComponent} from '../shared/messenger/messenger.component';
import {VisitorAuthGuard} from './visitor-auth.guard';
import {TemporaryUserAuthGuard} from './temp-user-auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: VisitorHomeComponent,
        canActivate: [VisitorAuthGuard]
    },
    {
        path: 'chat',
        component: MessengerComponent,
        canActivate: [TemporaryUserAuthGuard]
    },
    {
        path: 'chat/:id',
        component: MessengerComponent,
        canActivate: [TemporaryUserAuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [VisitorAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [VisitorAuthGuard]
    },
    // {
    //     path: '**',
    //     redirectTo: '/',
    //     pathMatch: 'full'
    // }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
    exports: [ RouterModule ]
})
export class VisitorRoutingModule {}
