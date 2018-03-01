import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminHomeComponent} from './home/home.component';
import {AdminAuthGuard} from './admin-auth.guard';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminHomeComponent,
        canActivate: [AdminAuthGuard]
    }

];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
    exports: [ RouterModule ]
})
export class AdminRoutingModule {}
