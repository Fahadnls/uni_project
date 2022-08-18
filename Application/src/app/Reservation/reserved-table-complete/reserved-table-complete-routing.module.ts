import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservedTableCompletePage } from './reserved-table-complete.page';

const routes: Routes = [
  {
    path: '',
    component: ReservedTableCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservedTableCompletePageRoutingModule {}
