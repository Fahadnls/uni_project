import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class RestaurantService {
  url = environment.baseUrl;
  constructor(public http: HttpClient) {}
  all_restaurant() {
    return this.http.get(this.url + "restaurant/all-Restaurant");
  }
  all_tea_shop() {
    return this.http.get(this.url + "restaurant/all-tea-shop");
  }
  delete_restaurant(id,mangerId) {
    return this.http.delete(this.url + "restaurant/delete/" + id + "/"+ mangerId);
  }
  create_restaurant(data) {
    return this.http.post(this.url + "restaurant/create-restaurant", data);
  }
  update_restaurant(id, data) {
    return this.http.post(this.url + "restaurant/update/" + id, data);
  }
  restaurant_detail(id) {
    return this.http.get(this.url + "restaurant/one-Restaurant/" + id);
  }
  restaurant_table(id) {
    return this.http.get(
      this.url + "restaurantTable/all-RestaurantTable/" + id
    );
  }
  restaurant_table_delete(id) {
    return this.http.delete(this.url + "restaurantTable/delete/" + id);
  }
  restaurant_table_create(data) {
    return this.http.post(this.url + "restaurantTable/create", data);
  }
  restaurant_Image(data) {
    return this.http.post(this.url + "restaurantImage/create", data);
  }
  restaurant_all_Image(id) {
    return this.http.get(
      this.url + "restaurantImage/all-RestaurantImage/" + id
    );
  }
  restaurant_reservation(id) {
    return this.http.get(
      this.url + "reservation/all-restaurant-Reservation/" + id
    );
  }
  cancel_reservation(id, data) {
    return this.http.post(
      this.url + "reservation/status-update-in-reservation/" + id,
      data
    );
  }
  deleteRestaurantImage(id) {
    return this.http.delete(this.url + "restaurantImage/delete/" + id);
  }

  // ========= restaurant menu =========== 
  allRestaurantMenu(id) {
    return this.http.get(this.url + "restaurant-menu/all-restaurant-menu/" + id);
  }
  createRestaurantMenu(data) {
    return this.http.post(this.url + "restaurant-menu/create" ,data);
  }
  editRestaurantMenu(id, data) {
    return this.http.post(this.url + "restaurant-menu/update/" + id, data);
  }
  delRestaurantMenu(id) {
    return this.http.delete(this.url + "restaurant-menu/del-restaurant-menu/" + id);
  }

  createMenuDetail(data) {
    return this.http.post(this.url + "restaurant-menu/create-men-detail" ,data);
  }
  editMenuDetail(id, data) {
    return this.http.post(this.url + "restaurant-menu/update-menu-detail/" + id, data);
  }
  delMenuDetail(id) {
    return this.http.delete(this.url + "restaurant-menu/del-menu/" + id);
  }
}
