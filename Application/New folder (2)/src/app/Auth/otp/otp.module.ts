import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpPageRoutingModule } from './otp-routing.module';

import { OtpPage } from './otp.page';
import { CodeInputModule } from 'angular-code-input';
import { ImageComponentModule } from 'src/app/component/component.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageComponentModule,
    OtpPageRoutingModule,
    TranslateModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
      code: 'abcdef',
    }),
  ],
  declarations: [OtpPage],
})
export class OtpPageModule {}
