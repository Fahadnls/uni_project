import { ToolService } from './tool.service';
import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CalenderService {
  constructor(
    private calendar: Calendar,
    public toolService: ToolService,
    public platform: Platform
  ) {}
  addToCalendar(title, location, message, startDate) {
    this.platform.ready().then(() => {
      this.calendar.createEventInteractively(
        title,
        location,
        message,
        startDate
      );
    });
  }
}
