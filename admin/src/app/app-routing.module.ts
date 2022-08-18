import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// *******************************************************************************
// Layouts

import { Layout1Component } from "./layout/layout-1/layout-1.component";

// *******************************************************************************
// Pages

import { CustomerComponent } from "./Pages/users/customer/customer.component";
import { ManagerComponent } from "./Pages/manager/manager.component";
import { FoodTypeComponent } from "./pages/food-type/food-type.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { RestaurentComponent } from "./pages/restaurent/restaurent.component";
import { ContactUsComponent } from "./pages/contact-us/contact-us.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { TeaShopComponent } from "./pages/tea-shop/tea-shop.component";
import { AddRestaurantComponent } from "./Pages/restaurent/add-restaurant/add-restaurant.component";
import { SupportComponent } from "./Pages/support/support.component";
import { AddRestaurantTableComponent } from "./Pages/restaurent/add-restaurant-table/add-restaurant-table.component";
import { AddImageRestaurantComponent } from "./Pages/restaurent/add-image-restaurant/add-image-restaurant.component";
import { AuthGuard } from "./guards/auth.guard";
import { ForwardGuard } from "./guards/forward.guard";
import { ReservationComponent } from "./Pages/reservation/reservation.component";
import { AdvertismentComponent } from "./Pages/advertisment/advertisment.component";
import { RestaurantQrcodeComponent } from "./Pages/restaurent/restaurant-qrcode/restaurant-qrcode.component";
import { RestaurantMenuComponent } from "./Pages/restaurent/restaurant-menu/restaurant-menu.component";

// *******************************************************************************
// Routes

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "customer",
    component: Layout1Component,
    children: [{ path: "", component: CustomerComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "manager",
    component: Layout1Component,
    children: [{ path: "", component: ManagerComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "food-type",
    component: Layout1Component,
    children: [{ path: "", component: FoodTypeComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "restaurant",
    component: Layout1Component,
    children: [{ path: "", component: RestaurentComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "contact-us",
    component: Layout1Component,
    children: [{ path: "", component: ContactUsComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "dashboard",
    component: Layout1Component,
    children: [{ path: "", component: DashboardComponent  , canActivate: [ForwardGuard] }],
  },
  {
    path: "tea-shop",
    component: Layout1Component,
    children: [{ path: "", component: TeaShopComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "addRestaurant/:type/:name/:id",
    component: Layout1Component,
    children: [{ path: "", component: AddRestaurantComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "support",
    component: Layout1Component,
    children: [{ path: "", component: SupportComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "advertisement",
    component: Layout1Component,
    children: [{ path: "", component: AdvertismentComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "restaurantTable/:name/:id",
    component: Layout1Component,
    children: [{ path: "", component: AddRestaurantTableComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "restaurantImage/:name/:id",
    component: Layout1Component,
    children: [{ path: "", component: AddImageRestaurantComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "reservation/:id",
    component: Layout1Component,
    children: [{ path: "", component: ReservationComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "restaurant-menu/:id",
    component: Layout1Component,
    children: [{ path: "", component: RestaurantMenuComponent, canActivate: [ForwardGuard] }],
  },
  {
    path: "restaurant-qrcode/:code/:title",
    component: RestaurantQrcodeComponent,
  },
];

// *******************************************************************************
//

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
