import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  url = environment.baseurl;

  constructor(
    public alertController: AlertController,
    public router: Router,
    private http: HttpClient,
    public translateService: TranslateService,
    public platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.translateService.get('dataSuccess').subscribe((resp: any) => {
        this.dataSuccess = resp;
      });
      this.translateService.get('dataError').subscribe((resp: any) => {
        this.dataError = resp;
      });
    });
  }
  dataSuccess: any;
  dataError: any;

  editProfile(id, data) {
    return this.http.post(this.url + 'user/update-user' + id, data);
  }
  contactUs(data) {
    return this.http.post(this.url + 'support/create', data);
  }
  changePassword(id, data) {
    return this.http.post(this.url + 'user/change-password/' + id, data);
  }
  updateProfile(id, data) {
    return this.http.post(this.url + 'user/update-user/' + id, data);
  }
  getUserDetail(id) {
    return this.http.get(this.url + 'user/one-user/' + id);
  }

  async logOut() {
    this.translateService.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    this.translateService.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });
    const alert = await this.alertController.create({
      header: this.dataSuccess.ConfirmLogOut,
      message: this.dataSuccess.AreYouSure,
      mode: 'ios',
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
