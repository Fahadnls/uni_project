import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservationDetailPage } from './reservation-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ReservationDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationDetailPageRoutingModule {}
