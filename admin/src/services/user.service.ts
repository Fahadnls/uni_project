import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.baseUrl;
  constructor(
    public http: HttpClient,
  ) { }
  all_user() {
    return this.http.get(this.url + 'user/all-user');
  };
  all_manger() {
    return this.http.get(this.url + 'restaurantManger/all-manager');
  };
  all_unassign_manger() {
    return this.http.get(this.url + 'restaurantManger/all-manager-unassign');
  };
  register_manger(data) {
    return this.http.post(this.url + 'restaurantManger/register' ,data);
  };
   update_manger(id,data){
     return this.http.post(this.url + 'restaurantManger/update-restaurantManger/'+ id ,data )
   } 
   block_user(id,data){
     return this.http.post(this.url + 'user/block-user/'+ id,data )
   } 
   block_manger(id, data){
     return this.http.post(this.url + 'restaurantManger/block-restaurantManger/'+ id ,data )
   } 
}
