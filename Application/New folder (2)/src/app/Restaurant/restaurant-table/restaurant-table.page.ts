import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ReservedTableCompletePage } from 'src/app/Reservation/reserved-table-complete/reserved-table-complete.page';
import { RestaurantService } from 'src/services/restaurant.service';
import { SocketService } from 'src/services/socket.service';
import { ToolService } from 'src/services/tool.service';
import { TimeSelectionPage } from '../../time-selection/time-selection.page';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import * as moment from 'moment';
@Component({
  selector: 'app-restaurant-table',
  templateUrl: './restaurant-table.page.html',
  styleUrls: ['./restaurant-table.page.scss'],
})
export class RestaurantTablePage implements OnInit {
  seat = [
    {
      seat: '1',
      isChecked: false,
    },
    {
      seat: '2',
      isChecked: false,
    },
    {
      seat: '3',
      isChecked: false,
    },
    {
      seat: '4',
      isChecked: true,
    },
    {
      seat: '5',
      isChecked: false,
    },
    {
      seat: '6',
      isChecked: false,
    },
    {
      seat: '7',
      isChecked: false,
    },
    {
      seat: '8',
      isChecked: false,
    },
  ];
  date = '';
  type: 'string';
  table = true;
  loading = false;
  specialEvent = '';
  restaurantName = '';
  restaurantLocation = '';
  restaurantDetails = {
    policy: '',
    restaurantId: 0,
    seatArea: '',
    specialEvent: '',
    restaurantLocation: '',
    restaurantName: '',
  };
  socket = this.socketsService.socket;

  constructor(
    private socketsService: SocketService,
    public modalController: ModalController,
    public active: ActivatedRoute,
    public reservation: RestaurantService,
    public router: Router,
    public tool: ToolService,
    private localNotifications: LocalNotifications,
    public translateService: TranslateService,
    public platform: Platform
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
  @ViewChild('content') private content: any;
  reservationTable = {
    slotForm: '',
    slotTo: '',
    seats: '4',
    additionalNote: '',
    specialEvent: '',
    isSpecialEvent: false,
    seatingArea: '',
    restaurantId: 0,
    userId: 0,
    reservationDate: new Date(moment().toISOString()),
  };
  restaurantSeatingArea = '';
  ionViewWillEnter() {
    this.restaurantSeatingArea = this.restaurantDetails.seatArea;
    this.reservationTable.seatingArea = this.restaurantDetails.seatArea;
    this.reservationTable.specialEvent = this.restaurantDetails.specialEvent;
    this.reservationTable.restaurantId = this.restaurantDetails.restaurantId;
    this.restaurantName = this.restaurantDetails.restaurantName;
    this.restaurantLocation = this.restaurantDetails.restaurantLocation;
    this.reservationTable.userId = JSON.parse(localStorage.getItem('userId'));
  }
  back() {
    this.modalController.dismiss();
  }

  calender(event) {
    this.reservationTable.reservationDate = new Date(
      moment(event._d).toISOString()
    );
  }

  seatingArea(event) {
    this.reservationTable.seatingArea = event.target.value;
  }
  tableType(event) {
    this.specialEvent = event.target.value;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TimeSelectionPage,
      backdropDismiss: false,
      cssClass: 'autoHightModal',
    });
    await modal.present();

    const data = await modal.onDidDismiss();
    if (data.data) {
      console.log(data.data);
      this.reservationTable.slotForm = new Date(
        moment(data.data.openingTime).toISOString()
      ).toString();
      this.reservationTable.slotTo = new Date(
        moment(data.data.closingTime).toISOString()
      ).toString();
      console.log(this.reservationTable.slotForm);
      console.log(this.reservationTable.slotTo);
    }
  }
  async reservedTableCompleted() {
    const modal = await this.modalController.create({
      component: ReservedTableCompletePage,
      backdropDismiss: false,
      componentProps: {
        restaurantDetail: {
          title: this.restaurantName,
          location: this.restaurantLocation,
          date: this.reservationTable.reservationDate,
        },
      },
      cssClass: 'reservedTableModal',
    });
    await modal.present();

    const data = await modal.onDidDismiss();
  }

  ngOnInit() {}
  selected_seat(i) {
    this.seat.map((val) => (val.isChecked = false));
    this.reservationTable.seats = this.seat[i].seat;
    this.seat[i].isChecked = !this.seat[i].isChecked;
  }
  reservedTable() {
    this.reservationTable.isSpecialEvent =
      this.specialEvent == 'regular' ? false : true;

    if (this.content.scrollToBottom) {
      this.content.scrollToTop(400);
    }

    if (
      (this.reservationTable.slotForm && this.reservationTable.slotTo) == ''
    ) {
      this.tool.presentToast(
        this.dataError.PleaseSelectTheTimeOfBooking,
        'danger',
        'top'
      );
    } else {
      let name = JSON.parse(localStorage.getItem('userData'))?.fullName;
      let data = {
        restaurantId: this.reservationTable.restaurantId,
        userName: name,
      };

      this.reservation.create_reservation(this.reservationTable).subscribe(
        (resp: any) => {
          this.localNotification(this.reservationTable.slotForm);
          this.loading = true;
          this.modalController.dismiss();
          this.reservedTableCompleted();
          this.tool.presentToast(
            this.dataSuccess.TableSuccessFullyBooked,
            'success',
            'top'
          );
          this.socket.emit('refreshReservation', data);
        },
        (err) => {
          setTimeout(() => {
            this.loading = false;
          }, 1300);
          if (err.error.error == 'No Table found in the Restaurant') {
            this.tool.presentToast(
              this.dataError.NoTableFoundInTheRestaurant,
              'danger',
              'bottom'
            );
          } else if (err.error.error == 'No Table found in this time slot') {
            this.tool.presentToast(
              this.dataError.NoTableFoundInThisTimeSlot,
              'danger',
              'bottom'
            );
          }
        }
      );
    }
  }
  localNotification(date) {
    var _30MinutesFromNow = new Date(moment(date).toISOString());
    if (_30MinutesFromNow) {
      this.localNotifications.schedule({
        title: 'Reservation Alert',
        text: '30 Minutes left for your reservation at ' + this.restaurantName,
        trigger: { at: _30MinutesFromNow },
        foreground: true,
        wakeup: true,
      });
    }
  }
}
