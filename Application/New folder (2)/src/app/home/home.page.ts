import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RestaurantService } from 'src/services/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  foodType = [];
  skeleton = [0, 0, 0, 0, 0, 0];
  showSkeleton = false;
  url = environment.baseurl;
  constructor(public foodTypeService: RestaurantService) {}

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
    this.isArabic();
  }

  isArabic() {
    if (localStorage.getItem('changeLanguage') != null) {
      let lan = localStorage.getItem('changeLanguage') == 'en' ? false : true;
      return lan;
    } else {
      return false;
    }
  }
}
