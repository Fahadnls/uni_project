import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';
import { ToolService } from 'src/services/tool.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import * as firebase from 'firebase';
import { OtpPage } from '../otp/otp.page';
import { TranslateService } from '@ngx-translate/core';
import { RecaptchaService } from 'src/services/recaptcha.service';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
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
  phoneFormRegister: FormGroup;

  registerData = {
    fullName: '',
    // password: '',
    // email: '',
    phoneNumber: '',
  };
  windowRef: any;
  constructor(
    public tool: ToolService,
    public register: AuthService,
    public modalController: ModalController,
    private router: Router,
    public firebaseAuthentication: FirebaseAuthentication,
    public plt: Platform,
    public translateService: TranslateService,
    public recaptchaService: RecaptchaService
  ) {
    translateService.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translateService.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });

    this.phoneFormRegister = new FormGroup({
      phone: new FormControl(undefined, [Validators.required]),
    });
    this.phoneFormRegister.valueChanges.subscribe((x) => {
      if (this.phoneFormRegister.valid) {
        this.registerData.phoneNumber = x.phone.e164Number;
      } else {
        this.registerData.phoneNumber = '';
      }
    });
  }
  dataSuccess: any;
  dataError: any;

  async ngOnInit() {
    this.windowRef = this.recaptchaService.windowRef;
  }
  loading = false;
  async registerBtn() {
    this.loading = true;
    await this.register.emailExist(this.registerData).subscribe(
      (resp: any) => {
        if (resp) {
          this.tool.presentToast(
            this.dataError.EmailOrPhoneNumberIsAlreadyExistPleaseTryOther,
            'danger',
            'bottom'
          );
          this.loading = false;
        } else {
          this.otpSender();
        }
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  async otpVerificationModal(refConfirm) {
    const modal = await this.modalController.create({
      component: OtpPage,
      swipeToClose: false,
      backdropDismiss: false,
      componentProps: {
        data: this.registerData,
        refConfirm: refConfirm,
        page: 'register',
      },
    });

    await modal.present();
  }

  otpSender() {
    if (this.plt.is('ios')) {
      this.signInUser(this.registerData.phoneNumber);
    } else {
      const appVerifier = this.windowRef.recaptchaVerifier;
      firebase
        .auth()
        .signInWithPhoneNumber(this.registerData.phoneNumber, appVerifier)
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
