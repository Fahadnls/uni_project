import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  windowRef;
  constructor(public plt: Platform) {}
  async setupReCaptcha() {
    if (!this.plt.is('ios')) {
      if (this.windowRef == undefined) {
        this.windowRef = await window;
        this.windowRef.recaptchaVerifier =
          await new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
          });
        await this.windowRef.recaptchaVerifier.render();
      }
    }
  }
}
