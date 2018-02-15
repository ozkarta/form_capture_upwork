import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BuyerHomeComponent} from './home/home.component';

export const routes: Routes = [
    {
        path: 'buyer',
        component: BuyerHomeComponent
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
    exports: [ RouterModule ]
})
export class BuyerRoutingModule {}
