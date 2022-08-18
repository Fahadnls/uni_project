import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CalenderService } from 'src/services/calender.service';

@Component({
  selector: 'app-reserved-table-complete',
  templateUrl: './reserved-table-complete.page.html',
  styleUrls: ['./reserved-table-complete.page.scss'],
})
export class ReservedTableCompletePage implements OnInit {
  constructor(
    public calenderService: CalenderService,
    private modalController: ModalController,
    public router: Router
  ) {}
  restaurantDetail = {
    title: '',
    location: '',
    date: '',
  };
  ngOnInit() {}
  ionViewDidEnter() {}
  addToCalender() {
    this.calenderService.addToCalendar(
      this.restaurantDetail.title,
      this.restaurantDetail.location,
      '',
      new Date(this.restaurantDetail.date.substring(0, 10))
    );
    this.continue();
  }
  continue() {
    this.router.navigate(['/tabs/home']);
    this.modalController.dismiss();
  }
}
