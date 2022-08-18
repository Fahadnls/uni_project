import { Component } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/services/translate-config.service';
import { Network } from '@ionic-native/network/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { RecaptchaService } from 'src/services/recaptcha.service';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isRTL = false;
  constructor(
    public translate: TranslateService,
    private network: Network,
    private openNativeSettings: OpenNativeSettings,
    public translateConfigService: TranslateConfigService,
    private modalController: ModalController,
    private platform: Platform,
    private alertController: AlertController,
    private auth: AuthService,
    public recaptchaService: RecaptchaService,
    private router: Router,
    private localNotifications: LocalNotifications,
  ) {
    this.platform.ready().then(() => {
      this.translate.onLangChange.subscribe((resp: any) => {
        this.isRTL = resp.lang == 'ar';
      });
      this.checkNetwork();
      this.setDefaultLanguage();
      if (localStorage.getItem('userData')) {
        this.blockChecker();
      }
      this.recaptchaService.setupReCaptcha();
      this.localNotifications.requestPermission();
    });
  }


  setDefaultLanguage() {
    if (this.translate.currentLang == undefined) {
      this.translateConfigService.setLanguage('en');
    }
  }
  checkNetwork() {
    // watch network for a disconnection
    this.network.onDisconnect().subscribe((resp) => {
      this.DisconnectAlert();
    });

    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      this.alertController.getTop().then((resp: any) => {
        if (resp !== undefined) {
          this.alertController.dismiss();
        }
      });
    });
  }
  async DisconnectAlert() {
    const alert = await this.alertController.create({
      header: 'Network Disconnected!',
      message: 'Make sure you are connected to a stable network',
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Open Settings',
          handler: () => {
            this.alertController.dismiss();
            this.openNativeSettings.open('wifi');
          },
        },
      ],
    });

    await alert.present();
  }
  isGuestUser() {
    return this.auth.isGuestUser();
  }
  blockChecker() {
    let id = JSON.parse(localStorage.getItem('userData')).id;
    this.auth.blockUser(id).subscribe((resp: any) => {
      if (resp.isBlocked == true) {
        localStorage.clear();
        this.router.navigate(['/']);
        this.blockAlert();
      }
    });
  }
  async blockAlert() {
    const alert = await this.alertController.create({
      header: 'Block',
      message: 'you are blocked by Super Admin',
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.alertController.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }
}
