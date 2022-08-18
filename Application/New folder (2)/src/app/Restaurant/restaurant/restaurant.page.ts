import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RestaurantService } from 'src/services/restaurant.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {
  data = [];
  foodId = 0;
  name = '';
  restaurantData = {
    latitude: 0,
    longitude: 0,
    searchInKm: 12,
    FoodTypeId: 0,
  };
  filterVal = '';
  searchKeys = ['title', 'distanceInMeters'];
  url = environment.baseurl;
  loading = true;
  emptyRestaurant = false;
  emptyTeaShop = false;
  restaurant = true;
  foodType = '';
  constructor(
    public restaurantService: RestaurantService,
    public active: ActivatedRoute,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {}

  bgReturner(img) {
    return (
      'linear-gradient(#00000080, #0000004d), url(' +
      this.url +
      img +
      ') no-repeat center center / cover'
    );
  }

  ionViewWillEnter() {
    this.foodId = this.active.snapshot.params.id;
    this.name = this.active.snapshot.params.name;
    this.foodType = this.active.snapshot.params.type;
    this.getLocationAndNearbyRestaurantsOrTeaShops();
  }
  async getLocationAndNearbyRestaurantsOrTeaShops() {
    await this.geolocation.getCurrentPosition().then((resp) => {
      this.restaurantData.latitude = resp.coords.latitude;
      this.restaurantData.longitude = resp.coords.longitude;
      this.restaurantData.FoodTypeId = this.foodId;
      if (this.name == 'restaurant') {
        this.restaurantService
          .allRestaurantByFoodType(this.restaurantData)
          .subscribe(
            (resp: any) => {
              this.data = resp;

              setTimeout(() => {
                this.loading = false;
              }, 800);
            },
            (err) => {
              this.loading = false;
            }
          );
      } else {
        this.restaurantService.teaRestaurant(this.restaurantData).subscribe(
          (resp: any) => {
            this.data = resp;

            setTimeout(() => {
              this.loading = false;
            }, 800);
          },
          (err) => {
            this.loading = false;
          }
        );
      }
    });
  }
}
