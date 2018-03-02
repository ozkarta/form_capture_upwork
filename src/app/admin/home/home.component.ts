import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.style.css']
})

export class AdminHomeComponent implements OnInit {
    public usersByZip: any[] = [];
    public activeZipUser = null;
    constructor(private userService: UserService) {

    }

    ngOnInit() {
        this.userService.getUsersByZip()
            .subscribe(
                usersByZip => {
                    this.usersByZip = usersByZip;
                    if (this.usersByZip && this.usersByZip.length) {
                        this.activeZipUser = this.usersByZip[0];
                    }
                },
                error => {
                    console.dir(error);
                }
            )
    }

    removeZipCode(user, zipCode) {

        user.zipCodes.splice(user.zipCodes.indexOf(zipCode), 1);
        this.usersByZip.forEach(zipUser => {
            if (zipCode === zipUser.zipCode) {

                for (let i=0; i<zipUser.user.length; i++) {
                    let usr = zipUser.user[i];
                    if (usr['_id'] === user['_id']) {
                        zipUser.user.splice(i, 1);
                    }
                }
            }
        });
        this.userService.updateUser(user)
            .subscribe(
                updatedUser => {
                    console.dir(updatedUser);
                },
                error => {
                    console.dir(error);
                }

            )

    }

    addNewUser(zip) {

    }
}