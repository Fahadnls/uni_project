import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FoodTypeService {
  url = environment.baseUrl;
  constructor(public http: HttpClient) {}
  all_Food_Type() {
    return this.http.get(this.url + "foodType/all-foodType");
  }
  add_Food_Type(data) {
    return this.http.post(this.url + "foodType/create", data);
  }
  edit_Food_Type(id, data) {
    return this.http.post(this.url + "foodType/update/" + id, data);
  }
}
