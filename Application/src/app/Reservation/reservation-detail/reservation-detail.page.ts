import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { LocationRouteService } from 'src/services/location-route.service';
import { RestaurantService } from 'src/services/restaurant.service';
import { ToolService } from 'src/services/tool.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.page.html',
  styleUrls: ['./reservation-detail.page.scss'],
})
export class ReservationDetailPage implements OnInit {
  url = environment.baseurl;
  reservationId;
  reservation = {
    slotForm: '',
    slotTo: '',
    tableBookingCode: '',
    status: '',
    cancelReason: '',
    cancelBy: '',
    additionalNote: '',
    seatingArea: '',
    createdAt: '',
    updatedAt: '',
    restaurantId: '',
    restaurantTableId: '',
    restaurant_table: {
      tableNumber: '',
      seatingCapacity: '',
    },
    restaurant: {
      title: '',
      mainLogo: '',
      location: '',
    },
    title: '',
    description: '',
    promotionalText: '',
    mainLogo: '',
    openingTime: '',
    closingTime: '',
    latitude: '',
    longitude: '',
    type: '',
    isSpecialEventSupport: '',
  };
  reservationDetails = {
    id: 0,
  };
  cancelDetails = {
    status: 'Cancel',
    cancelReason: '',
    cancelBy: 'user',
  };
  loading = true;
  constructor(
    public alertController: AlertController,
    public reservationService: RestaurantService,
    public active: ActivatedRoute,
    public locationRouteService: LocationRouteService,
    private modalController: ModalController,
    public tool: ToolService,
    public translateService: TranslateService
  ) {
    translateService.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translateService.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });
  }
  dataSuccess: any;
  dataError: any;
  back() {
    this.modalController.dismiss({ isCancelled: false });
  }
  ionViewDidEnter() {
    this.reservationId = this.active.snapshot.params.id;
    this.reservationService
      .reservationDetail(this.reservationDetails.id)
      .subscribe(
        (resp: any) => {
          this.reservation = resp;
          setTimeout(() => {
            this.loading = false;
          }, 800);
        },
        (err) => {
          this.loading = false;
        }
      );
  }
  makeDirection() {
    this.locationRouteService.makeDirection(
      this.reservation.restaurant.location
    );
  }
  ngOnInit() {}

  async cancelRes() {
    const alert = await this.alertController.create({
      header: this.dataSuccess.CancelReservation,
      message: this.dataSuccess.WhyAreYouCancelPleaseMentionBelow,
      inputs: [
        {
          type: 'text',
          placeholder: this.dataSuccess.EnterYourReason,
        },
      ],
      buttons: [
        {
          text: this.dataSuccess.No,
          role: 'No',
          cssClass: 'danger',
          handler: () => {},
        },
        {
          text: this.dataSuccess.Yes,
          role: 'yes',
          cssClass: 'success',
          handler: (data) => {
            if (data[0] == '') {
              this.tool.presentToast(
                this.dataError.PleaseEnterYourReasonWhyCancelYourReservation,
                'danger',
                'top'
              );
              return false;
            } else {
              this.cancelDetails.cancelReason = data[0];
              this.reservationService
                .cancel_reservation(
                  this.reservationDetails.id,
                  this.cancelDetails
                )
                .subscribe(
                  (resp: any) => {
                    setTimeout(() => {
                      this.loading = false;
                    }, 800);
                    this.tool.presentToast(
                      this.dataError.CancelYourReservation,
                      'success',
                      'top'
                    );
                    this.modalController.dismiss({ isCancelled: true });
                  },
                  (err) => {
                    this.loading = false;
                  }
                );
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
