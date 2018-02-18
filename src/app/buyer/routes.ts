import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BuyerHomeComponent} from './home/home.component';
import {BuyerAuthGuard} from './buyer-auth.guard';

export const routes: Routes = [
    {
        path: 'buyer',
        component: BuyerHomeComponent,
        canActivate: [BuyerAuthGuard]
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
    exports: [ RouterModule ]
})
export class BuyerRoutingModule {}
