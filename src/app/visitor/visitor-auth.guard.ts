import 'rxjs/add/operator/take';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AppService} from '../shared/service/app.service';

@Injectable()
export class VisitorAuthGuard implements CanActivate {
    constructor(private router: Router,
                private appService: AppService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.appService.user
            .take(1)
            .map((user: any) => {
                if (user && user.role) {
                    switch(user.role) {
                        case  'buyer' :
                            this.router.navigate(['/buyer']).then();
                            return false;

                        default:
                            return true;
                    }

                }
                return true;
            });
    }
}
