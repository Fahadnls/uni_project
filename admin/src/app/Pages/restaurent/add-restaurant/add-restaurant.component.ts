import { OnInit, ViewEncapsulation } from "@angular/core";
import { Component, ViewChild, AfterViewInit } from "@angular/core";
import {
  DropzoneComponent,
  DropzoneConfig,
  DropzoneDirective,
} from "ngx-dropzone-wrapper";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { FileUploader } from "ng2-file-upload";
import { environment } from "../../../../environments/environment";
import { AppService } from "../../../app.service";
import { UserService } from "../../../../services/user.service";
import { FoodTypeService } from "../../../../services/food-type.service";
import { NotificationService } from "../../../../services/notification.service";
import { RestaurantService } from "../../../../services/restaurant.service";
import { ImageUploadService } from "../../../../services/image-upload.service";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
@Component({
  encapsulation: ViewEncapsulation.Emulated,
  selector: "app-add-restaurant",
  templateUrl: "./add-restaurant.component.html",
  styleUrls: [
    "./add-restaurant.component.scss",
    "../../../../vendor/libs/ngx-dropzone-wrapper/ngx-dropzone-wrapper.scss",
    "../../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
    "../../../../vendor/libs/ng-select/ng-select.scss",
    "../../../../vendor/libs/ngb-timepicker/ngb-timepicker.scss",
  ],
})
export class AddRestaurantComponent implements OnInit {
  Restaurant = {
    title: "",
    mainLogo: "",
    openingTime: "",
    closingTime: "",
    seatingArea: "Any",
    latitude: "",
    longitude: "",
    location: "",
    type: "",
    isSpecialEventSupport: true,
    restaurantMangerId: null,
    preRestaurantMangerId: null,
    promotionalText: "",
    description: "",
    foodType: [],
    policy: "",
  };
  RestaurantManager = [];
  seatArea = [{ seats: "Any" }, { seats: "Inside" }, { seats: "Outside" }];
  foodType = [];
  name = "";
  id = 0;
  openTiming = {
    hour: 8,
    minute: 0,
  };
  closeTiming = {
    hour: 21,
    minute: 0,
  };
  type = "";
  constructor(
    public userService: UserService,
    public foodTypeService: FoodTypeService,
    public active: ActivatedRoute,
    public location: Location,
    public notification: NotificationService,
    public restaurantService: RestaurantService,
    public imageUploadService: ImageUploadService,
    public appService: AppService
  ) {
    this.appService.pageTitle = "Add Table";
  }
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;

  handleAddressChange(address: Address) {
    this.Restaurant.location = address.formatted_address;
    this.Restaurant.latitude = address.geometry.location.lat().toString();
    this.Restaurant.longitude = address.geometry.location.lng().toString();
  }
  optionsMAP = {
    types: [],
    // remove pk while production build
    componentRestrictions: { country: ["SA"] },
  };
  ngOnInit() {
    this.name = this.active.snapshot.params.name;
    this.id = this.active.snapshot.params.id;
    this.type = this.active.snapshot.params.type;

    this.foodTypeService.all_Food_Type().subscribe((resp: any) => {
      this.foodType = resp;
    });
    if (this.name == "update") {
      this.userService.all_manger().subscribe((resp: any) => {
        this.RestaurantManager = resp;
      });
      this.restaurantService
        .restaurant_detail(this.id)
        .subscribe((resp1: any) => {
          console.log(resp1);
          
          this.userService.all_unassign_manger().subscribe((resp: any) => {
            this.RestaurantManager = resp;
            this.RestaurantManager.push(resp1.restaurant_manger);
            this.Restaurant = resp1;
            this.Restaurant.seatingArea = resp1.seatingArea;
          });
          this.Restaurant.location = resp1.location
          this.Restaurant.foodType = resp1.restaurant_food_types.map((val) => {
            return val.foodTypeId;
          });
          this.openTiming = {
            hour: parseInt(resp1.openingTime.substr(0, 2)),
            minute: parseInt(resp1.openingTime.substr(3, 5)),
          };

          this.closeTiming = {
            hour: parseInt(resp1.closingTime.substr(0, 2)),
            minute: parseInt(resp1.closingTime.substr(3, 5)),
          };
          if (resp1.openingTime.substr(-2) == "PM") {
            this.openTiming.hour = this.openTiming.hour + 12;
          }
          if (resp1.closingTime.substr(-2) == "PM") {
            this.closeTiming.hour = this.closeTiming.hour + 12;
          }
        });
    } else {
      this.userService.all_unassign_manger().subscribe((resp: any) => {
        this.RestaurantManager = resp;
      });
    }
    if (this.type == "teaShop") {
      this.Restaurant.type = "Tea";
    } else {
      this.Restaurant.type = "Restaurant";
    }
  }
  back() {
    this.location.back();
  }
  imagePicked(event) {
    let file = event.target.files[0];
    this.imageUploadService.uploadImage(file).subscribe((resp: any) => {
      this.Restaurant.mainLogo = resp;
    });
  }
  time24to12(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    var i = h < 10 ? "0" + h : h;
    var ampm = H < 12 ? " AM" : " PM";
    ts = i + ts.substr(2, 3) + ampm;
    return ts;
  }
  timeConverter(h, m) {
    let hour = h.toString().length == 1 ? "0" + h.toString() : h.toString();
    let minutes = m.toString().length == 1 ? "0" + m.toString() : m.toString();
    return hour + ":" + minutes;
  }

  createRestaurant() {
    this.Restaurant.openingTime = this.time24to12(
      this.timeConverter(this.openTiming.hour, this.openTiming.minute)
    );
    this.Restaurant.closingTime = this.time24to12(
      this.timeConverter(this.closeTiming.hour, this.closeTiming.minute)
    );

    if (
      (this.Restaurant.title &&
        this.Restaurant.mainLogo &&
        this.Restaurant.promotionalText &&
        this.Restaurant.isSpecialEventSupport &&
        this.Restaurant.foodType &&
        this.Restaurant.openingTime &&
        this.Restaurant.closingTime &&
        this.Restaurant.description &&
        this.Restaurant.policy &&
        this.Restaurant.seatingArea) == ""
    ) {
      let type;
      this.type == "Restaurant"
        ? (type = "Restaurant")
        : (type = "Coffee Shop");

      this.notification.showToast("Please fill the All fields", type, "error");
    } else {
      console.log(this.Restaurant);
      
      this.restaurantService
        .create_restaurant(this.Restaurant)
        .subscribe((resp: any) => {
          this.Restaurant = {
            title: "",
            mainLogo: "",
            openingTime: "",
            closingTime: "",
            seatingArea: "",
            latitude: "0",
            longitude: "0",
            location: "",
            type: "",
            isSpecialEventSupport: true,
            restaurantMangerId: 0,
            preRestaurantMangerId: 0,
            promotionalText: "",
            description: "",
            foodType: [],
            policy: "",
          };
          this.location.back();
          let type;
          this.type == "Restaurant"
            ? (type = "Restaurant")
            : (type = "Coffee Shop");
          this.notification.showToast(
            type,
            type + " Added Successfully",
            "success"
          );
        });
    }
  }
  updateRestaurant() {
    this.Restaurant.openingTime = this.time24to12(
      this.timeConverter(this.openTiming.hour, this.openTiming.minute)
    );
    this.Restaurant.closingTime = this.time24to12(
      this.timeConverter(this.closeTiming.hour, this.closeTiming.minute)
    );
    if (
      (this.Restaurant.title &&
        this.Restaurant.mainLogo &&
        this.Restaurant.promotionalText &&
        this.Restaurant.isSpecialEventSupport &&
        this.Restaurant.openingTime &&
        this.Restaurant.closingTime &&
        this.Restaurant.description &&
        this.Restaurant.policy &&
        this.foodType.length != 0 &&
        this.Restaurant.seatingArea) == ""
    ) {
      let type;
      this.type == "Restaurant"
        ? (type = "Restaurant")
        : (type = "Coffee Shop");
      this.notification.showToast("Please fill the All fields", type, "error");
    } else {
      this.restaurantService
        .update_restaurant(this.id, this.Restaurant)
        .subscribe((resp: any) => {
          this.location.back();
          let type;
          this.type == "Restaurant"
            ? (type = "Restaurant")
            : (type = "Coffee Shop");
          this.notification.showToast(
            type,
            type + " data update Successfully",
            "success"
          );
        });
    }
  }
}
