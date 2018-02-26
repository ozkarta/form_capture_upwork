import {Injectable} from '@angular/core';
import {Observable}from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AppService} from './app.service';

@Injectable()
export class UserService {
  private apiBaseUrl: string = '/api/v1'
  constructor(private http: HttpClient,
              private appService: AppService) {}

  public getUsersBySearchOptions(options: any): Observable<any> {

      return this.http.get(`${this.apiBaseUrl}/users`, {params: options})
          .map(res => {
              return res['users'];
          })
          .catch((error:Response|any) => {
              return Observable.throw(error);
          });

  }

  public registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/users/register`, user)
      .map(res => {
        return this.setUserInBworserAfterLogIn(res);
      })
      .catch((error:Response|any) => {
        return Observable.throw(error);
      });
  }

  public registerTemporaryUser(user: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/users/register-temp-user`, user)
        .map(res => {
            return this.setUserInBworserAfterLogIn(res);
        })
        .catch((error:Response|any) => {
            return Observable.throw(error);
        });
  }

  public signInUser(userLike: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/users/sign-in`, userLike)
      .map((res: any) => {
        return this.setUserInBworserAfterLogIn(res);
      })
      .catch((error:Response|any) => {
        return Observable.throw(error);
      });
  }

  public logOut(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/users/log-out`)
      .map((res: any) => {

        if (res != null && res.token == null && res.auth == false) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.appService.isLoggedIn.next(false);
          this.appService.user.next(null);
          return res;
        } else {
          return Observable.throw({message: 'Incorrect Response'});
        }

      })
      .catch((error:Response|any) => {
        return Observable.throw(error);
      });
  }

  private setUserInBworserAfterLogIn(res: any) {
      if (res != null && res.auth == true) {
          if (res.token) {
              localStorage.setItem('token', JSON.stringify(res.token));
          }

          if (res.user) {
              localStorage.setItem('user', JSON.stringify(res.user));
          }
          this.appService.isLoggedIn.next(true);
          this.appService.user.next(res.user);
          return res;
      } else {
          return Observable.throw({message: 'Incorrect Response'});
      }
  }
}
