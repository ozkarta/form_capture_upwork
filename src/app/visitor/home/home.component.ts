import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {AppService} from '../../shared/service/app.service';
@Component({
    templateUrl: './home.component.html',
    styleUrls: ['home.style.css']
})

export class VisitorHomeComponent implements OnInit {
    public searchOptions: any = {
        zip: ''
    };
    public message: string = '';
    public sender: any = {};

    public activeUser = null;
    public searchResult: any = null;
    public sessionUser: any = null;

    constructor(private userService: UserService,
                private modalService: NgbModal,
                private router: Router,
                private appService: AppService) {
    }

    ngOnInit() {
        let user = sessionStorage.getItem('chatSessionUser');
        if (user) {
            this.sessionUser = JSON.parse(user);
        }
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
        if (this.sessionUser) {
            this.router.navigate(['chat', user['_id']]);
            return;
        }
        this.activeUser = user;
        this.modalService.open(modalWindow).result.then((result) => {
            // this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    sendMessage() {
        sessionStorage.setItem('chatSessionUser', JSON.stringify(this.sender));
        this.appService.sessionUser.next(this.sender);
    }
}