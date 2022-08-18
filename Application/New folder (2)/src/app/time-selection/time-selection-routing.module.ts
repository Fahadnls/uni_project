import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeSelectionPage } from './time-selection.page';

const routes: Routes = [
  {
    path: '',
    component: TimeSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeSelectionPageRoutingModule {}
