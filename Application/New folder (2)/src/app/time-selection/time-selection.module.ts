import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeSelectionPageRoutingModule } from './time-selection-routing.module';

import { TimeSelectionPage } from './time-selection.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TimeSelectionPageRoutingModule
  ],
  declarations: [TimeSelectionPage]
})
export class TimeSelectionPageModule {}
