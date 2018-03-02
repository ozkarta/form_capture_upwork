import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.style.css']
})

export class AdminHomeComponent implements OnInit {
    public usersByZip: any[] = [];
    public activeZipUser = null;
    private modelRef: any = null;
    public userModel: any = null;
    // public search = (terms: Observable<string>) =>
    //     terms.debounceTime(200)
    //         .distinctUntilChanged()
    //         .switchMap(term => this.userService.getUsersBySearchOptions({search: term}));

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this.userService.getUsersBySearchOptions({search: term, ne: this.activeZipUser.zipCode}));

    constructor(private userService: UserService,
                private modalService: NgbModal) {

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

    addNewUser(modalWindow, zipUser) {
        this.modelRef = this.modalService.open(modalWindow);
        this.modelRef.result.then(
            (result) => {
                this.userModel = null;
            }
        )
    }


    userInputFormatter(value: any) {
        return `${value['firstName']} ${value['lastName']}`;
    }

    userResultFormatter(value: any) {
        return `${value['firstName']} ${value['lastName']}`;
    }

    addZipToUser() {
        console.dir(this.activeZipUser);
        console.dir(this.userModel);

        this.userModel.zipCodes.push(this.activeZipUser.zipCode);

        this.userService.updateUser(this.userModel)
            .subscribe(
                updatedUser => {
                    console.dir(updatedUser);
                },
                error => {
                    console.dir(error);
                }

            );

        this.activeZipUser.user.push(this.userModel);

        this.userModel = null;

        this.modelRef.close();
        this.modelRef = null;
    }

    disableUserAdd() {
        return (!this.userModel || typeof this.userModel !== 'object');
    }
}