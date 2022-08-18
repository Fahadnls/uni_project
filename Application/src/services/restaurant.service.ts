import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  url = environment.baseurl;

  constructor(private http: HttpClient) {}
  foodType() {
    return this.http.get(this.url + 'foodType/all-foodType');
  }
  allRestaurantByFoodType(data) {
    return this.http.post(
      this.url + 'restaurantFoodType/all-Restaurant-by-FoodType/',
      data
    );
  }
  Restaurant(data) {
    return this.http.post(this.url + 'restaurant/all-tea-shop-nearby', data);
  }
  restaurantDetails(id) {
    return this.http.get(this.url + 'restaurant/one-Restaurant/' + id);
  }
  currentReservation(id) {
    return this.http.get(
      this.url + 'reservation/all-pending-Reservation/' + id
    );
  }
  Reservation(id) {
    return this.http.get(
      this.url + 'reservation/all-Reservation/' + id
    );
  }
  reservationDetail(id) {
    return this.http.get(this.url + 'reservation/one-Reservation/' + id);
  }
  create_reservation(data) {
    return this.http.post(this.url + 'reservation/create', data);
  }
  cancel_reservation(id,data) {
    return this.http.post(this.url + 'reservation/status-update-in-reservation/'+ id, data);
  }
  sendFeedBack(data) {
    return this.http.post(this.url + 'feedback/create', data);
  }
  getRestaurantMenu(id) {
    return this.http.get(this.url + 'restaurant-menu/all-restaurant-menu/' + id);
  }
}
