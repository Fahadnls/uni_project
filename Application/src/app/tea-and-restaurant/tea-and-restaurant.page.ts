import { Component, OnInit } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { RestaurantService } from 'src/services/restaurant.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tea-and-restaurant',
  templateUrl: './tea-and-restaurant.page.html',
  styleUrls: ['./tea-and-restaurant.page.scss'],
})
export class TeaAndRestaurantPage implements OnInit {
  ads = [];
  user = {
    fullName: '',
  };
  foodType = [];
  skeleton = [0, 0, 0, 0];
  showSkeleton = false;
  url = environment.baseurl;
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
  loading = true;
  emptyRestaurant = false;
  emptyTeaShop = false;
  restaurant = true;
  constructor(
    public translateService: TranslateService,
    public foodTypeService: RestaurantService,
    public photoViewer: PhotoViewer,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.foodTypeService.foodType().subscribe(
      (resp: any) => {
        this.foodType = resp;
        setTimeout(() => {
          this.showSkeleton = true;
        }, 1300);
      },
      (err) => {
        this.showSkeleton = true;
      }
    );
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.getLocationAndNearbyRestaurantsOrTeaShops();
  }
  bgReturner(img) {
    return (
      'linear-gradient(#00000080, #0000004d), url(' +
      this.url +
      img +
      ') no-repeat center center / cover'
    );
  }
  async getLocationAndNearbyRestaurantsOrTeaShops() {
    await this.geolocation.getCurrentPosition().then((resp) => {
      this.restaurantData.latitude = resp.coords.latitude;
      this.restaurantData.longitude = resp.coords.longitude;
      this.restaurantData.FoodTypeId = this.foodId;
      this.foodTypeService.Restaurant(this.restaurantData).subscribe(
        (resp: any) => {
          this.data = resp;
          // console.log( resp)

          setTimeout(() => {
            this.showSkeleton = true;
            this.loading = false;
          }, 800);
        },
        (err) => {
          this.showSkeleton = true;
          this.loading = false;
        }
      );
    });
  }
}
