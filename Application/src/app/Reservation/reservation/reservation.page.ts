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
  // currentReservation = [
  //   {
  //     id: 207,
  //     slotForm: '2022-07-13T16:46:00.000Z',
  //     slotTo: '2022-07-13T17:46:00.000Z',
  //     reservationDate: '2022-07-12T21:00:00.000Z',
  //     tableBookingCode: '490085',
  //     status: 'Reserved',
  //     cancelReason: null,
  //     cancelBy: null,
  //     additionalNote: '',
  //     seatingArea: 'Any',
  //     seats: 4,
  //     feedback: null,
  //     rating: 0,
  //     createdAt: '2022-07-13T15:46:53.000Z',
  //     updatedAt: '2022-07-13T15:46:53.000Z',
  //     restaurantId: 36,
  //     restaurantTableId: 52,
  //     userId: 17,
  //     restaurant_table: {
  //       tableNumber: '1',
  //     },
  //     restaurant: {
  //       mainLogo: '1643741290645.png',
  //       title: 'BYAT',
  //       type: 'Tea',
  //       location: 'Al Imam Saud Ibn Faysal Rd, Riyadh 13521, Saudi Arabia',
  //     },
  //   },
  //   {
  //     id: 204,
  //     slotForm: '2022-07-06T09:06:00.000Z',
  //     slotTo: '2022-07-06T09:55:00.000Z',
  //     reservationDate: '2022-07-05T21:00:00.000Z',
  //     tableBookingCode: '670396',
  //     status: 'Reserved',
  //     cancelReason: null,
  //     cancelBy: null,
  //     additionalNote: '',
  //     seatingArea: 'Any',
  //     seats: 4,
  //     feedback: null,
  //     rating: 0,
  //     createdAt: '2022-07-06T01:56:12.000Z',
  //     updatedAt: '2022-07-06T01:56:12.000Z',
  //     restaurantId: 38,
  //     restaurantTableId: 51,
  //     userId: 17,
  //     restaurant_table: {
  //       tableNumber: '1',
  //     },
  //     restaurant: {
  //       mainLogo: '1645972351495.png',
  //       title: 'Early bird',
  //       type: 'Tea',
  //       location: 'An Nada, Riyadh 13317, Saudi Arabia',
  //     },
  //   },
  //   {
  //     id: 203,
  //     slotForm: '2022-06-30T14:30:00.000Z',
  //     slotTo: '2022-06-30T15:28:00.000Z',
  //     reservationDate: '2022-06-29T21:00:00.000Z',
  //     tableBookingCode: '770019',
  //     status: 'Reserved',
  //     cancelReason: null,
  //     cancelBy: null,
  //     additionalNote: '',
  //     seatingArea: 'Any',
  //     seats: 4,
  //     feedback: null,
  //     rating: 0,
  //     createdAt: '2022-06-30T14:29:05.000Z',
  //     updatedAt: '2022-06-30T14:29:05.000Z',
  //     restaurantId: 38,
  //     restaurantTableId: 51,
  //     userId: 17,
  //     restaurant_table: {
  //       tableNumber: '1',
  //     },
  //     restaurant: {
  //       mainLogo: '1645972351495.png',
  //       title: 'Early bird',
  //       type: 'Tea',
  //       location: 'An Nada, Riyadh 13317, Saudi Arabia',
  //     },
  //   },
  //   {
  //     id: 200,
  //     slotForm: '2022-06-30T11:22:00.000Z',
  //     slotTo: '2022-06-30T12:22:00.000Z',
  //     reservationDate: '2022-06-29T21:00:00.000Z',
  //     tableBookingCode: '488613',
  //     status: 'Reserved',
  //     cancelReason: null,
  //     cancelBy: null,
  //     additionalNote: '',
  //     seatingArea: 'Any',
  //     seats: 4,
  //     feedback: null,
  //     rating: 0,
  //     createdAt: '2022-06-30T10:23:10.000Z',
  //     updatedAt: '2022-06-30T10:23:10.000Z',
  //     restaurantId: 36,
  //     restaurantTableId: 52,
  //     userId: 17,
  //     restaurant_table: {
  //       tableNumber: '1',
  //     },
  //     restaurant: {
  //       mainLogo: '1643741290645.png',
  //       title: 'BYAT',
  //       type: 'Tea',
  //       location: 'Al Imam Saud Ibn Faysal Rd, Riyadh 13521, Saudi Arabia',
  //     },
  //   },
  //   {
  //     id: 193,
  //     slotForm: '2022-06-12T13:00:00.000Z',
  //     slotTo: '2022-06-12T14:00:00.000Z',
  //     reservationDate: '2022-06-12T09:00:02.000Z',
  //     tableBookingCode: '791869',
  //     status: 'Reserved',
  //     cancelReason: null,
  //     cancelBy: null,
  //     additionalNote: '',
  //     seatingArea: 'Any',
  //     seats: 4,
  //     feedback: null,
  //     rating: 0,
  //     createdAt: '2022-06-12T09:00:33.000Z',
  //     updatedAt: '2022-06-12T09:00:33.000Z',
  //     restaurantId: 38,
  //     restaurantTableId: 51,
  //     userId: 17,
  //     restaurant_table: {
  //       tableNumber: '1',
  //     },
  //     restaurant: {
  //       mainLogo: '1645972351495.png',
  //       title: 'Early bird',
  //       type: 'Tea',
  //       location: 'An Nada, Riyadh 13317, Saudi Arabia',
  //     },
  //   },
  // ];
  // previousReservation = [
  //   {
  //     id: 149,
  //     slotForm: '2022-03-23T18:46:00.000Z',
  //     slotTo: '2022-03-23T19:46:00.000Z',
  //     reservationDate: '2022-03-22T21:00:00.000Z',
  //     tableBookingCode: '511563',
  //     status: 'Completed',
  //     cancelReason: '',
  //     cancelBy: '',
  //     additionalNote: '',
  //     seatingArea: 'Any',
  //     seats: 4,
  //     feedback: 4.5,
  //     rating: 0,
  //     createdAt: '2022-03-23T14:46:20.000Z',
  //     updatedAt: '2022-03-29T13:11:15.000Z',
  //     restaurantId: 36,
  //     restaurantTableId: 52,
  //     userId: 17,
  //     restaurant_table: {
  //       tableNumber: '1',
  //     },
  //     restaurant: {
  //       mainLogo: '1643741290645.png',
  //       title: 'BYAT',
  //       type: 'Tea',
  //       location: 'Al Imam Saud Ibn Faysal Rd, Riyadh 13521, Saudi Arabia',
  //     },
  //   },
  //   {
  //     id: 142,
  //     slotForm: '2022-03-20T21:00:00.000Z',
  //     slotTo: '2022-03-20T22:55:00.000Z',
  //     reservationDate: '2022-03-19T21:00:00.000Z',
  //     tableBookingCode: '919282',
  //     status: 'Cancel',
  //     cancelReason: 'T',
  //     cancelBy: 'user',
  //     additionalNote: '',
  //     seatingArea: 'Any',
  //     seats: 4,
  //     feedback: null,
  //     rating: 0,
  //     createdAt: '2022-03-20T15:56:22.000Z',
  //     updatedAt: '2022-03-29T13:10:45.000Z',
  //     restaurantId: 38,
  //     restaurantTableId: 51,
  //     userId: 17,
  //     restaurant_table: {
  //       tableNumber: '1',
  //     },
  //     restaurant: {
  //       mainLogo: '1645972351495.png',
  //       title: 'Early bird',
  //       type: 'Tea',
  //       location: 'An Nada, Riyadh 13317, Saudi Arabia',
  //     },
  //   },
  //   {
  //     id: 141,
  //     slotForm: '2022-03-20T19:00:00.000Z',
  //     slotTo: '2022-03-20T19:34:00.000Z',
  //     reservationDate: '2022-03-19T21:00:00.000Z',
  //     tableBookingCode: '562311',
  //     status: 'Cancel',
  //     cancelReason: 'H',
  //     cancelBy: 'user',
  //     additionalNote: '',
  //     seatingArea: 'Any',
  //     seats: 2,
  //     feedback: null,
  //     rating: 0,
  //     createdAt: '2022-03-20T15:47:06.000Z',
  //     updatedAt: '2022-03-29T13:10:33.000Z',
  //     restaurantId: 38,
  //     restaurantTableId: 51,
  //     userId: 17,
  //     restaurant_table: {
  //       tableNumber: '1',
  //     },
  //     restaurant: {
  //       mainLogo: '1645972351495.png',
  //       title: 'Early bird',
  //       type: 'Tea',
  //       location: 'An Nada, Riyadh 13317, Saudi Arabia',
  //     },
  //   },
  // ];
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
