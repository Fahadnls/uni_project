import { LocationRouteService } from './../../../services/location-route.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RestaurantService } from 'src/services/restaurant.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { RestaurantTablePage } from '../restaurant-table/restaurant-table.page';
import { AuthService } from 'src/services/auth.service';
import { ToolService } from 'src/services/tool.service';
import { TranslateConfigService } from 'src/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.page.html',
  styleUrls: ['./restaurant-detail.page.scss'],
})
export class RestaurantDetailPage implements OnInit {
  maxHeight = 290;
  images = [];
  darkenCondition = true;
  restaurantId;
  restaurantDetails = {
    id: 3,
    title: '',
    description: '',
    promotionalText: '',
    mainLogo: '',
    openingTime: '',
    closingTime: '',
    seatingArea: '',
    location: '',
    policy: '',
    isSpecialEventSupport: '',
    restaurant_images: [],
    feedbacks: [
      {
        rating: 0,
        rateCount: 0,
      },
    ],
  };
  restaurantImage = '';
  url = environment.baseurl;
  loading = true;
  skeletonImage = [0, 0, 0, 0];
  constructor(
    public restaurant: RestaurantService,
    public active: ActivatedRoute,
    public locationRouteService: LocationRouteService,
    public photoViewer: PhotoViewer,
    public modalController: ModalController,
    public authService: AuthService,
    public tool: ToolService,
    public alertController: AlertController,
    public router: Router,
    public translate: TranslateService,
    public translateConfigService: TranslateConfigService
  ) {
    translate.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translate.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });
  }
  dataSuccess: any;
  dataError: any;
  logicalToolbar = true;
  ngOnInit() {}
  isGuestUser() {
    return this.authService.isGuestUser();
  }

  ionViewWillEnter() {
    this.restaurantId = this.active.snapshot.params.id;
    this.restaurant.restaurantDetails(this.restaurantId).subscribe(
      (resp: any) => {
        this.restaurantDetails = resp;
        this.images = resp.restaurant_images;
        this.restaurantImage = this.url + resp.mainLogo;
        setTimeout(() => {
          this.logicalToolbar = false;
          this.loading = false;
        }, 1000);
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  onScroll(event) {
    if (event.detail.scrollTop > 100) {
      this.darkenCondition = false;
    } else {
      this.darkenCondition = true;
    }
  }
  makeDirection() {
    this.locationRouteService.makeDirection(this.restaurantDetails.location);
  }
  imageView(i) {
    let image = this.url + this.restaurantDetails.restaurant_images[i].imageUrl;
    this.photoViewer.show(image, this.restaurantDetails.title);
  }
  async bookTable() {
    if (this.isGuestUser()) {
      // this.tool.presentToast(this.dataError.PleseLoginToContinue , 'danger',top)
      this.login();
    } else {
      const modal = await this.modalController.create({
        component: RestaurantTablePage,
        backdropDismiss: false,
        componentProps: {
          restaurantDetails: {
            seatArea: this.restaurantDetails.seatingArea,
            restaurantId: this.restaurantDetails.id,
            restaurantName: this.restaurantDetails.title,
            restaurantLocation: this.restaurantDetails.location,
            specialEvent: this.restaurantDetails.isSpecialEventSupport,
            policy: this.restaurantDetails.policy,
          },
        },
        cssClass: 'reservedTableModal',
      });
      await modal.present();

      const data = await modal.onDidDismiss();
    }
  }
  async login() {
    const alert = await this.alertController.create({
      header: this.dataSuccess.Warning,
      message: this.dataSuccess.NavigateToLogin,
      buttons: [
        {
          text: this.dataSuccess.No,
          role: 'No',
          cssClass: 'danger',
          handler: () => {},
        },
        {
          text: this.dataSuccess.Login,
          role: 'yes',
          cssClass: 'success',
          handler: () => {
            localStorage.clear();
            this.router.navigate(['']);
          },
        },
      ],
    });
    await alert.present();
  }
}
