import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RestaurantService } from 'src/services/restaurant.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  data = [];
  restaurantName;
  showSkeleton = true;
  url = environment.baseurl;
  restaurantId;
  constructor(
    public restaurantService: RestaurantService,
    public active: ActivatedRoute,
    ) {}

  ionViewWillEnter() {
    this.restaurantId = this.active.snapshot.params.id;
    this.restaurantService.getRestaurantMenu(this.restaurantId).subscribe(
      (resp: any) => {
        console.log(resp);
        this.restaurantName = resp.restaurant;
        this.data = resp.restaurantMenu;
        setTimeout(() => {
          this.showSkeleton = false;
        }, 1000);
      },
      (err) => {
        this.showSkeleton = false;
      }
    );
  }
  ngOnInit() {}
}
