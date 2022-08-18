import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { ToolService } from 'src/services/tool.service';
import * as firebase from 'firebase';
import { AuthService } from 'src/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { RecaptchaService } from 'src/services/recaptcha.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  windowRef: any;
  verifCode: any;
  code = '';
  refConfirm;
  page;
  data = {
    id: '',
    fullName: '',
    phoneNumber: '',
  };
  loading = false;
  constructor(
    private toolService: ToolService,
    public platform: Platform,
    private router: Router,
    public user: AuthService,
    public tool: ToolService,
    private modalController: ModalController,
    public translateService: TranslateService,
    public recaptchaService: RecaptchaService
  ) {}
  dataSuccess: any;
  dataError: any;
  back() {
    this.modalController.dismiss();
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      this.windowRef = this.recaptchaService.windowRef;
      this.translateService.get('dataSuccess').subscribe((resp: any) => {
        this.dataSuccess = resp;
      });
      this.translateService.get('dataError').subscribe((resp: any) => {
        this.dataError = resp;
      });
    });
  }

  // this called every time when user changed the code
  onCodeChanged(e) {
    this.code = e;
  }

  verifyPhoneNumber() {
    let tokenPhone = firebase.auth.PhoneAuthProvider.credential(
      this.refConfirm,
      this.verifCode
    );
    firebase
      .auth()
      .signInWithCredential(tokenPhone)
      .then((verifiedData) => {
        if (this.page == 'login') {
          this.afterPhoneValidationLog();
        } else {
          this.afterPhoneValidationReg();
        }
      })
      .catch(() => {
        this.loading = false;
        this.toolService.presentToast(
          this.dataError.SomethingWentWrong,
          'danger',
          'top'
        );
      });
  }

  async onCodeCompleted(e) {
    this.loading = true;
    this.verifCode = e;
    if (this.platform.is('ios')) {
      this.verifyPhoneNumber();
    } else {
      await this.windowRef.confirmationResult
        .confirm(this.verifCode)
        .then(async () => {
          if (this.page == 'login') {
            this.afterPhoneValidationLog();
          } else {
            this.afterPhoneValidationReg();
          }
        })
        .catch(() => {
          this.loading = false;
          this.toolService.presentToast(
            this.dataError.SomethingWentWrong,
            'danger',
            'top'
          );
        });
    }
  }
  async afterPhoneValidationLog() {
    localStorage.setItem('userData', JSON.stringify(this.data));
    localStorage.setItem('userId', JSON.stringify(this.data.id));
    this.loading = false;
    this.router.navigate(['/tabs/tea-and-restaurant']);
    this.modalController.dismiss();
  }
  async afterPhoneValidationReg() {
    await this.user.register(this.data).subscribe(
      (resp: any) => {
        this.data = {
          id: '',
          fullName: '',
          phoneNumber: '',
        };
        localStorage.setItem('userData', JSON.stringify(resp.user));
        this.loading = false;
        this.router.navigate(['/tabs/tea-and-restaurant']);
        this.modalController.dismiss();
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
}
