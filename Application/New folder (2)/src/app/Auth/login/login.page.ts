import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
import { AuthService } from 'src/services/auth.service';
import { RecaptchaService } from 'src/services/recaptcha.service';
import { ToolService } from 'src/services/tool.service';
import { OtpPage } from '../otp/otp.page';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  onlyCountries: CountryISO[] = [
    CountryISO.Bahrain,
    CountryISO.Kuwait,
    CountryISO.Oman,
    CountryISO.Qatar,
    CountryISO.SaudiArabia,
    CountryISO.UnitedArabEmirates,
  ];
  phoneForm: FormGroup;
  loginData = {
    phoneNumber: '',
  };

  loading = false;
  windowRef: any;
  constructor(
    public tool: ToolService,
    public login: AuthService,
    public loadingController: LoadingController,
    public ModalController: ModalController,
    private router: Router,
    public translateService: TranslateService,
    private alertController: AlertController,
    public firebaseAuthentication: FirebaseAuthentication,
    public plt: Platform,
    public recaptchaService: RecaptchaService
  ) {
    this.phoneForm = new FormGroup({
      phone: new FormControl(undefined, [Validators.required]),
    });
    this.phoneForm.valueChanges.subscribe((x) => {
      if (this.phoneForm.valid) {
        this.loginData.phoneNumber = x.phone.e164Number;
      } else {
        this.loginData.phoneNumber = '';
      }
    });
  }
  dataSuccess: any;
  dataError: any;
  ionViewWillEnter() {
    this.plt.ready().then(() => {
      this.translateService.get('dataSuccess').subscribe((resp: any) => {
        this.dataSuccess = resp;
      });
      this.translateService.get('dataError').subscribe((resp: any) => {
        this.dataError = resp;
      });
      this.windowRef = this.recaptchaService.windowRef;
    });
  }

  async loginBtn() {
    this.loading = true;
    await this.login.login(this.loginData).subscribe(
      (resp: any) => {
        this.loginData = resp.user;
        if (resp.user.isBlocked) {
          localStorage.clear();
          this.router.navigate(['/']);
          this.blockAlert();
        } else {
          this.otpSender();
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        if (err.error.error == 'phone number already exist!')
          this.tool.presentToast(
            this.dataError.phoneNumberAlreadyExist,
            'danger',
            'bottom'
          );
      }
    );
  }
  skipLogin() {
    let loginData = {
      phoneNumber: '+966 011 234 5678',
      fullName: 'Guest User',
      id: '_GUESTUSER_',
    };
    localStorage.setItem('userData', JSON.stringify(loginData));
    this.router.navigate(['/tabs/tea-and-restaurant']);
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
            localStorage.clear();
          },
        },
      ],
    });

    await alert.present();
  }
  async ngOnInit() {}

  async otpVerificationModal(refConfirm) {
    const modal = await this.ModalController.create({
      component: OtpPage,
      swipeToClose: false,
      backdropDismiss: false,
      componentProps: {
        data: this.loginData,
        refConfirm: refConfirm,
        page: 'login',
      },
    });

    await modal.present();
  }

  otpSender() {
    if (this.plt.is('ios')) {
      this.signInUser(this.loginData.phoneNumber);
    } else {
      const appVerifier = this.windowRef.recaptchaVerifier;
      firebase
        .auth()
        .signInWithPhoneNumber(this.loginData.phoneNumber, appVerifier)
        .then((result) => {
          this.loading = false;
          this.windowRef.confirmationResult = result;
          this.otpVerificationModal(null);
        })
        .catch((err) => {
          this.loading = false;
          this.tool.presentToast(
            this.dataError.SomethingWentWrong,
            'danger',
            'top'
          );
        });
    }
  }

  public signInUser(phone) {
    this.firebaseAuthentication
      .verifyPhoneNumber(phone, 60)
      .then((val) => {
        this.loading = false;
        this.otpVerificationModal(val);
      })
      .catch((er) => {
        this.loading = false;
        this.tool.presentToast(
          this.dataError.SomethingWentWrong,
          'danger',
          'top'
        );
      });
  }
}
