import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RateUsPageRoutingModule } from './rate-us-routing.module';

import { RateUsPage } from './rate-us.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RateUsPageRoutingModule
  ],
  declarations: [RateUsPage]
})
export class RateUsPageModule {}
