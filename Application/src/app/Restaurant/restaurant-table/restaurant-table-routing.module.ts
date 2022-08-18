import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantTablePage } from './restaurant-table.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantTablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantTablePageRoutingModule {}
