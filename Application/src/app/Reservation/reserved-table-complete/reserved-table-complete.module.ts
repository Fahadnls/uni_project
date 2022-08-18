import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservedTableCompletePageRoutingModule } from './reserved-table-complete-routing.module';

import { ReservedTableCompletePage } from './reserved-table-complete.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReservedTableCompletePageRoutingModule
  ],
  declarations: [ReservedTableCompletePage]
})
export class ReservedTableCompletePageModule {}
