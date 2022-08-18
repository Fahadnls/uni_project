import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeaAndRestaurantPage } from './tea-and-restaurant.page';

const routes: Routes = [
  {
    path: '',
    component: TeaAndRestaurantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeaAndRestaurantPageRoutingModule {}
