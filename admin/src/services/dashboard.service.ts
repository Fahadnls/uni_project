import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  url = environment.baseUrl;
  constructor(public http: HttpClient) {}

  get_Dashboard_Data_For_Super_Admin() {
    return this.http.get(
      this.url + "dashboard/get-dashboard-data-for-super-admin"
    );
  }
  get_Dashboard_Data_For_restaurant(id) {
    return this.http.get(
      this.url + "dashboard/get-dashboard-data-for-restaurant/" + id
    );
  }
}
