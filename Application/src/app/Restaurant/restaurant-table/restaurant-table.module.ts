import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantTablePageRoutingModule } from './restaurant-table-routing.module';

import { RestaurantTablePage } from './restaurant-table.page';
// Calendar UI Module
import { CalendarModule } from 'ion2-calendar';
import { ImageComponentModule } from 'src/app/component/component.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ImageComponentModule,
    RestaurantTablePageRoutingModule,
    CalendarModule
  ],
  declarations: [RestaurantTablePage]
})
export class RestaurantTablePageModule {}
