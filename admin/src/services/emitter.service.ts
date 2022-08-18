import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {
  refreshReservation = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  newReservation() {
    this.refreshReservation.emit();
  }
}
