import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs';

@Injectable()
export class AppService {
  public busyIndicatorSubscription: Subscription;
  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _user: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor() {
    console.log('Constructor od app.service');
    let storageToken = localStorage.getItem('token');
    let storageUser = localStorage.getItem('user');
    if (storageUser) {
      this._user.next(storageUser);
      if (storageToken) {
          this._loggedIn.next(true);
      }
    }




  }

  get isLoggedIn() {
    return this._loggedIn;
  }

  get user() {
    return this._user;
  }
}
