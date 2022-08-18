import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeaAndRestaurantPageRoutingModule } from './tea-and-restaurant-routing.module';

import { TeaAndRestaurantPage } from './tea-and-restaurant.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TeaAndRestaurantPageRoutingModule
  ],
  declarations: [TeaAndRestaurantPage]
})
export class TeaAndRestaurantPageModule {}
