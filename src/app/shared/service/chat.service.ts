import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChatService {

  constructor(private http: HttpClient) {
  }

  getChatListForUser(userId): Observable<any> {
    return this.http.get(`/api/v1/chat/chat-list?userId=${userId}`)
      .map((res: any) => {
        return res;
      })
      .catch((error: Response|any) => {
        return Observable.throw(error);
      });
  }

}
