import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {Router} from '@angular/router';
@Component({
    selector: 'app-buyer-navbar',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.style.css']
})

export class BuyerNavComponent implements OnInit {
    constructor(private userService: UserService,
                private router: Router) {
    }

    ngOnInit() {
    }

    logOut() {
        this.userService.logOut()
            .subscribe(
                success => {
                    this.router.navigate(['/']);
                },
                error => {
                    console.dir(error);
                }
            )
    }
}