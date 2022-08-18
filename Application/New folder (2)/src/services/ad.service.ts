import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  url = environment.baseurl;

  constructor(private http: HttpClient) {}
  allAds() {
    return this.http.get(this.url + 'advertisement/all-ads');
  }
}
