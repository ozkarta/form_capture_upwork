import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {VisitorHomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: VisitorHomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
    exports: [ RouterModule ]
})
export class VisitorRoutingModule {}
