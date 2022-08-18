import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = environment.baseurl;

  constructor(private http: HttpClient) {}

  GetAllMessages(userId) {
    return this.http.get(this.url + 'message/get-all-messages/' + userId);
  }

  SendMessage(data): Observable<any> {
    return this.http.post(this.url + 'message/send-message', data);
  }
}
