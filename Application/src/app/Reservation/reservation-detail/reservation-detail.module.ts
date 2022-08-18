import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationDetailPageRoutingModule } from './reservation-detail-routing.module';

import { ReservationDetailPage } from './reservation-detail.page';
import { ImageComponentModule } from 'src/app/component/component.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageComponentModule,
    TranslateModule,
    ReservationDetailPageRoutingModule
  ],
  declarations: [ReservationDetailPage]
})
export class ReservationDetailPageModule {}
