import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  url = environment.baseUrl;
  constructor(
    public http: HttpClient,
  ) { }
  uploadImage(file) {
    const fd = new FormData();
    fd.append("image", file);
    return this.http.post(this.url + "image/saveImages", fd);
  };
}
