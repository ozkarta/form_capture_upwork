import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
@Component({
    templateUrl: './home.component.html',
    styleUrls: ['home.style.css']
})

export class VisitorHomeComponent implements OnInit {
    public searchOptions: any = {
        zip: ''
    };

    public searchResult: any = null;

    constructor(private userService: UserService) {
    }

    ngOnInit() {

    }

    search() {
        this.userService.getUsersBySearchOptions(this.searchOptions)
            .subscribe(
                users => {
                    this.searchResult = users;
                },
                errorResponse => {
                    console.dir(errorResponse);
                }
            )
    }
}