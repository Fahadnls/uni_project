import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ToolService } from 'src/services/tool.service';

@Component({
  selector: 'app-time-selection',
  templateUrl: './time-selection.page.html',
  styleUrls: ['./time-selection.page.scss'],
})
export class TimeSelectionPage implements OnInit {
  constructor(
    private modalController: ModalController,
    public toolService: ToolService
  ) {}

  ngOnInit() {}

  timeBetween = {
    openingTime: '',
    closingTime: '',
  };

  close() {
    this.modalController.dismiss();
  }
  isNegative(num) {
    if (Math.sign(num) === -1) {
      return true;
    }
    return false;
  }
  confirm() {
    if (
      new Date(moment(this.timeBetween.openingTime).toISOString()).getTime()
    ) {
      let difference = moment(this.timeBetween.closingTime).diff(
        moment(this.timeBetween.openingTime)
      );
      if (this.isNegative(difference)) {
        this.toolService.presentToast(
          'End time must be greater than start time',
          'danger',
          'bottom'
        );
      } else {
        this.timeBetween.openingTime =
          new Date(moment(this.timeBetween.openingTime).toISOString())
            .toISOString()
            .substring(0, 10) +
          ' ' +
          new Date(moment(this.timeBetween.openingTime).toISOString())
            .toTimeString()
            .substring(0, 6) +
          '00';
        if (this.timeBetween.closingTime != '') {
          this.timeBetween.closingTime =
            new Date(moment(this.timeBetween.closingTime).toISOString())
              .toISOString()
              .substring(0, 10) +
            ' ' +
            new Date(moment(this.timeBetween.closingTime).toISOString())
              .toTimeString()
              .substring(0, 6) +
            '00';
        } else {
          let startTime = this.timeBetween.openingTime;
          console.log(startTime);
          this.timeBetween.closingTime = new Date(
            new Date(moment(startTime).toISOString()).getTime() + 1800000
          ).toISOString();
          this.timeBetween.closingTime =
            new Date(moment(this.timeBetween.closingTime).toISOString())
              .toISOString()
              .substr(0, 10) +
            ' ' +
            new Date(moment(this.timeBetween.closingTime).toISOString())
              .toTimeString()
              .substr(0, 6) +
            '00';
        }
        this.modalController.dismiss(this.timeBetween);
      }
    } else {
      this.toolService.presentToast(
        'Please Select Both Times',
        'danger',
        'bottom'
      );
    }
  }
}
