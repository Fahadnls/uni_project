import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ForwardGuard } from './guards/forward.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./Auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./Auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'tabs',
    canActivate: [ForwardGuard],
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'home',
    canActivate: [ForwardGuard],
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'restaurant/:id/:name/:type',
    loadChildren: () =>
      import('./Restaurant/restaurant/restaurant.module').then(
        (m) => m.RestaurantPageModule
      ),
  },
  {
    path: 'restaurant-detail/:id',
    loadChildren: () =>
      import('./Restaurant/restaurant-detail/restaurant-detail.module').then(
        (m) => m.RestaurantDetailPageModule
      ),
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./Profile/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./Profile/edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./Profile/contact-us/contact-us.module').then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: 'restaurant-table',
    loadChildren: () =>
      import('./Restaurant/restaurant-table/restaurant-table.module').then(
        (m) => m.RestaurantTablePageModule
      ),
  },
  {
    path: 'time-selection',
    loadChildren: () =>
      import('./time-selection/time-selection.module').then(
        (m) => m.TimeSelectionPageModule
      ),
  },
  {
    path: 'reserved-table-complete',
    loadChildren: () =>
      import(
        './Reservation/reserved-table-complete/reserved-table-complete.module'
      ).then((m) => m.ReservedTableCompletePageModule),
  },
  {
    path: 'reservation-detail/:id',
    loadChildren: () =>
      import('./Reservation/reservation-detail/reservation-detail.module').then(
        (m) => m.ReservationDetailPageModule
      ),
  },
  {
    path: 'rate-us/:reservationId/:restaurantId',
    loadChildren: () =>
      import('./rate-us/rate-us.module').then((m) => m.RateUsPageModule),
  },
  {
    path: 'otp',
    loadChildren: () =>
      import('./Auth/otp/otp.module').then((m) => m.OtpPageModule),
  },

  {
    path: 'forgot-password',
    loadChildren: () => import('./Auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
