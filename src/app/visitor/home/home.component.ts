import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {AppService} from '../../shared/service/app.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChatService} from '../../shared/service/chat.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['home.style.css']
})

export class VisitorHomeComponent implements OnInit {
    public searchOptions: any = {
        zip: ''
    };
    public searchResult: any = null;
    public messageText: string = '';
    public modelRef: NgbModalRef;
    public user: any = {};
    public destinationUser: any = null;

    constructor(private userService: UserService,
                private modalService: NgbModal,
                private router: Router,
                private appService: AppService,
                private chatService: ChatService) {
    }

    ngOnInit() {
        this.subscribeUser();
    }

    subscribeUser () {
        this.appService.user.subscribe(
            user => {
                if (user) {
                    this.user = user;
                }
            }
        );
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
        this.destinationUser = user;
        this.modelRef = this.modalService.open(modalWindow);
    }

    sendMessage() {

    }

}