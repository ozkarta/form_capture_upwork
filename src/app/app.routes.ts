import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

export const routes: Routes = [
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
export class AppRoutingModule {}
