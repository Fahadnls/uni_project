import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/services/auth.service';
import { ToolService } from 'src/services/tool.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotData = {
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  };
  verificationCodeApi;
  userId;
  loading = false;
  type = 'email';
  constructor(
    public navCtrl: NavController,
    public userService: AuthService,
    public tool: ToolService,
    public translateService: TranslateService
  ) {
    translateService.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translateService.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });
  }
  dataSuccess: any;
  dataError: any;

  back() {
    if (this.type == 'email') {
      this.navCtrl.back();
    } else if (this.type == 'verify') {
      this.type = 'email';
    } else if (this.type == 'password') {
      this.type = 'verify';
    }
  }

  ngOnInit() {}
  forgotPass() {
    if (this.type == 'email') {
      this.loading = true;
      this.userService.forgot_password(this.forgotData).subscribe(
        (resp: any) => {

          this.loading = false;
          this.userId = resp.user.id;
          this.verificationCodeApi = resp.verificationCode;
          this.type = 'verify';
        },
        (err) => {
          this.loading = false;
          if (err.error.error == 'Email does not exist')
            this.tool.presentToast(
              this.dataError.EmailDoesNotExist,
              'danger',
              'bottom'
            );
          else if (
            err.error.error == 'Error occurred while sending Verification Code'
          )
            this.tool.presentToast(
              this.dataError.ErrorOccurredWhileSendingVerificationCode,
              'danger',
              'bottom'
            );
        }
      );
    } else if (this.type == 'verify') {
      if (this.forgotData.code == this.verificationCodeApi) {
        this.type = 'password';
      } else {
        this.tool.presentToast(this.dataError.invalidCode, 'danger', 'bottom');
      }
    } else if (this.type == 'password') {
      if (this.forgotData.password == this.forgotData.confirmPassword) {
        if (this.forgotData.password.length < 6) {
          this.tool.presentToast(
            this.dataError.PasswordMustGreaterThan6Letter,
            'danger',
            'bottom'
          );
        } else {
          this.loading = true;
          this.userService
            .update_user_password(this.userId, this.forgotData)
            .subscribe(
              (resp: any) => {
                this.tool.presentToast(
                  this.dataSuccess.PasswordChangeSuccessFully,
                  'success',
                  'top'
                );
                this.navCtrl.navigateRoot('/');
                this.loading = false;
              },
              (err) => {
                this.loading = false;
              }
            );
        }
      } else {
        this.tool.presentToast(
          this.dataError.PasswordNotMatch,
          'danger',
          'bottom'
        );
      }
    }
  }
}
