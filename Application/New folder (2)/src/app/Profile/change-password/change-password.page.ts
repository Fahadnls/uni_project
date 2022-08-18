import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/services/profile.service';
import { ToolService } from 'src/services/tool.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  changePassword = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  loading = false;

  constructor(
    public tool: ToolService,
    public profile: ProfileService,
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

  ngOnInit() {}
  changePassBtn() {
    if (
      (this.changePassword.newPassword &&
        this.changePassword.confirmPassword &&
        this.changePassword.oldPassword) == ''
    ) {
      this.tool.presentToast(
        this.dataError.PleaseFillTheAllFields,
        'danger',
        'bottom'
      );
    } else {
      if (
        this.changePassword.newPassword != this.changePassword.confirmPassword
      ) {
        this.tool.presentToast(
          this.dataError.PasswordNotMatch,
          'danger',
          'bottom'
        );
      } else {
        this.loading = true;
        let id = JSON.parse(localStorage.getItem('userId'));
        this.profile.changePassword(id, this.changePassword).subscribe(
          (resp: any) => {
            this.loading = false;
            this.changePassword = {
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            };

            this.tool.presentToast(
              this.dataSuccess.PasswordChangeSuccessFully,
              'success',
              'top'
            );
          },
          (err) => {
            this.loading = false;
            if (
              err.error.error == 'Password should be greater than 6 characters!'
            )
              this.tool.presentToast(
                this.dataError.PasswordMustGreaterThan6Letter,
                'danger',
                'bottom'
              );
            else if (err.error.error == 'Invalid old password!')
              this.tool.presentToast(
                this.dataError.InvalidOldPassword,
                'danger',
                'bottom'
              );
          }
        );
      }
    }
  }
}
