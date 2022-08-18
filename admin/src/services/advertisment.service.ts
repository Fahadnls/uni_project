import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvertismentService {

  url = environment.baseUrl;
  constructor(public http: HttpClient) {}
  all_advertisement() {
    return this.http.get(this.url + "advertisement/all-ads");
  }
  add_advertisement(data) {
    return this.http.post(this.url + "advertisement/create", data);
  }
  edit_advertisement(id, data) {
    return this.http.post(this.url + "advertisement/update/" + id, data);
  }
  del_advertisement(id) {
    return this.http.delete(this.url + "advertisement/del/" + id);
  }
}
