import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';
import { ProfileService } from 'src/services/profile.service';
import { TranslateConfigService } from 'src/services/translate-config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
 url= environment.baseurl;
  constructor(
    public alertController: AlertController,
    public router: Router,
    public profile: ProfileService,
    public translate: TranslateService,
    public authService: AuthService,
    public translateConfigService: TranslateConfigService
  ) {
    translate.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translate.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });
  }
  dataSuccess: any;
  dataError: any;

  ngOnInit() {}
  async logOutBtn() {
    this.profile.logOut();
  }

  getName() {
    return localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData'))?.fullName
      : '';
  }
  getProfile() {
    return (JSON.parse(localStorage.getItem('userData'))?.profileImage)
      ? this.url + JSON.parse(localStorage.getItem('userData'))?.profileImage
      : '';
  }

  getPhone() {
    return localStorage.getItem('userData')
      ?   JSON.parse(localStorage.getItem('userData'))?.phoneNumber
      : '';
  }
  isGuestUser() {
    return this.authService.isGuestUser();
  }
  loginBtn() {
    localStorage.clear();
    this.router.navigate(['']);
  }
  async changeLanguageAlert() {
    this.translate.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    this.translate.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });
    const alert = await this.alertController.create({
      header: this.dataSuccess.changeLanguage,
      mode: 'ios',
      inputs: [
        {
          name: 'english',
          type: 'radio',
          label: this.dataSuccess.english,
          value: 'en',
          checked: this.translate.currentLang == 'en',
        },
        {
          name: 'arabic',
          type: 'radio',
          label: this.dataSuccess.arabic,
          value: 'ar',
          checked: this.translate.currentLang == 'ar',
        },
      ],
      buttons: [
        {
          text: this.dataSuccess.cancel,
          role: 'cancel',
        },
        {
          text: this.dataSuccess.change,
          handler: (value) => {
            localStorage.setItem('changeLanguage' , value)
            this.translateConfigService.setLanguage(value);
          },
        },
      ],
    });

    await alert.present();
  }
}
