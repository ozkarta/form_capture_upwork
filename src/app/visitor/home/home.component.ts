import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
    templateUrl: './home.component.html',
    styleUrls: ['home.style.css']
})

export class VisitorHomeComponent implements OnInit {
    public searchOptions: any = {
        zip: ''
    };
    public message: any = {

    };

    public searchResult: any = null;

    constructor(private userService: UserService,
                private modalService: NgbModal) {
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

    openNewMessageModal(modalWindow, user) {
        this.modalService.open(modalWindow).result.then((result) => {
            // this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    sendMessage() {

    }
}