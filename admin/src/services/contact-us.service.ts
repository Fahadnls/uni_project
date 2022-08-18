import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  url = environment.baseUrl;
  constructor(
    public http: HttpClient,
  ) { }
  all_Complaint() {
    return this.http.get(this.url + "support/all-Support");
  }
}
