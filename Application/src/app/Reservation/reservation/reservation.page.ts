import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';
import { LocationRouteService } from 'src/services/location-route.service';
import { RestaurantService } from 'src/services/restaurant.service';
import { ReservationDetailPage } from '../reservation-detail/reservation-detail.page';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage {
  url = environment.baseurl;
  currentReservation = [];
  previousReservation = [];
  status = 'current';
  skeleton = [0, 0, 0];
  showSkeleton = true;
  constructor(
    private modalController: ModalController,
    private reservationService: RestaurantService,
    public locationRouteService: LocationRouteService,
    public authService: AuthService
  ) {}
  async reservationDetail(index, item) {
    const modal = await this.modalController.create({
      component: ReservationDetailPage,
      backdropDismiss: false,
      componentProps: {
        reservationDetails: {
          id: item.id,
        },
      },
      cssClass: 'reservedTableModal',
    });
    await modal.present();
    await modal.onDidDismiss().then((resp: any) => {
      if (resp.data) {
        if (resp.data.isCancelled) {
          if (this.status == 'current') {
            item.status = 'Cancel';
            this.previousReservation.splice(0, 0, item);
            this.currentReservation.splice(index, 1);
          }
        }
      }
    });
  }

  isGuestUser() {
    return this.authService.isGuestUser();
  }

  ionViewWillEnter() {
    this.showSkeleton = true;
    let id = JSON.parse(localStorage.getItem('userId'));
    if (this.isGuestUser()) {
      setTimeout(() => {
        this.showSkeleton = false;
      }, 1300);
    } else {
      this.reservationService.Reservation(id).subscribe(
        (resp: any) => {
          this.currentReservation = resp.pendingReservation;
          this.previousReservation = resp.CompletedReservation;
          console.log(resp);

          setTimeout(() => {
            this.showSkeleton = false;
          }, 1300);
        },
        () => {
          setTimeout(() => {
            this.showSkeleton = false;
          }, 1300);
        }
      );
    }
  }
  makeDirection(item) {
    this.locationRouteService.makeDirection(item.restaurant.location);
  }
  segment(event) {
    this.status = event.detail.value;
  }
}
