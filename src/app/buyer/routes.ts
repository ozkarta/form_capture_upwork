import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BuyerHomeComponent} from './home/home.component';
import {BuyerAuthGuard} from './buyer-auth.guard';
import {MessengerComponent} from '../shared/messenger/messenger.component';

export const routes: Routes = [
    {
        path: 'buyer',
        component: BuyerHomeComponent,
        canActivate: [BuyerAuthGuard]
    },
    {
        path: 'buyer/chat',
        component: MessengerComponent,
        canActivate: [BuyerAuthGuard]
    }

];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
    exports: [ RouterModule ]
})
export class BuyerRoutingModule {}
