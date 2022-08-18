import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.baseurl;

  constructor(private http: HttpClient) {}
  login(data) {
    return this.http.post(this.url + 'user/sign-in', data);
  }
  register(data) {
    return this.http.post(this.url + 'user/register', data);
  }
  emailExist(data) {
    return this.http.post(this.url + 'user/is-user-exist', data);
  }
  forgot_password(data) {
    return this.http.post(this.url + 'user/forgot-password', data);
  }
  update_user_password(id, data) {
    return this.http.post(this.url + 'user/update-password/' + id, data);
  }
  blockUser(id) {
    return this.http.get(this.url + 'user/block/' + id);
  }
  isGuestUser() {
    return JSON.parse(localStorage.getItem('userData')).id == '_GUESTUSER_'
      ? true
      : false;
  }
}
