import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  url = environment.baseUrl;
  constructor(public http: HttpClient) {}
  signIn(data) {
    return this.http.post(this.url + "restaurantManger/sign-in", data);
  }
  blockManager(id) {
    return this.http.get(this.url + "restaurantManger/block-check/" + id);
  }
  isAdmin() {
    return localStorage.getItem('adminType-With-love') == 'SuperAdmin'
      ? true
      : false;
  }
}
