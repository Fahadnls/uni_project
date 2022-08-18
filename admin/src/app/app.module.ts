import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

// *******************************************************************************
// NgBootstrap

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// *******************************************************************************
// App

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppService } from "./app.service";
import { LayoutModule } from "./layout/layout.module";

// *******************************************************************************
// Pages
import { HttpClientModule } from "@angular/common/http";
import { CustomerComponent } from "./Pages/users/customer/customer.component";
import { ManagerComponent } from "./Pages/manager/manager.component";
import { FoodTypeComponent } from "./pages/food-type/food-type.component";
import { RestaurentComponent } from "./pages/restaurent/restaurent.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ContactUsComponent } from "./pages/contact-us/contact-us.component";
import { LaddaModule } from "angular2-ladda";
import { TeaShopComponent } from "./pages/tea-shop/tea-shop.component";
import { ToastrModule } from "ngx-toastr";
import { AddRestaurantComponent } from "./Pages/restaurent/add-restaurant/add-restaurant.component";
import { FileUploadModule } from "ng2-file-upload";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { environment } from "../environments/environment";
import { NgSelectModule } from "@ng-select/ng-select";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { SupportComponent } from "./Pages/support/support.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NgxImageGalleryModule } from "ngx-image-gallery";
import { AddRestaurantTableComponent } from "./Pages/restaurent/add-restaurant-table/add-restaurant-table.component";
import { AddImageRestaurantComponent } from "./Pages/restaurent/add-image-restaurant/add-image-restaurant.component";
import { ReservationComponent } from "./Pages/reservation/reservation.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { AdvertismentComponent } from './Pages/advertisment/advertisment.component';
// import { QrCodeModule } from 'ng-qrcode';
import { QRCodeModule } from 'angularx-qrcode';
import { RestaurantQrcodeComponent } from './Pages/restaurent/restaurant-qrcode/restaurant-qrcode.component';
import { RestaurantMenuComponent } from './Pages/restaurent/restaurant-menu/restaurant-menu.component';

// *******************************************************************************
//
// const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
// url: "https://httpbin.org/post",
// url: environment.baseUrl,
// maxFilesize: 50,
// acceptedFiles: "image/*",
// };
@NgModule({
  declarations: [
    AppComponent,
    // Pages

    CustomerComponent,
    ManagerComponent,
    FoodTypeComponent,
    RestaurentComponent,
    AuthComponent,
    DashboardComponent,
    ContactUsComponent,
    TeaShopComponent,
    AddRestaurantComponent,
    SupportComponent,
    AddRestaurantTableComponent,
    AddImageRestaurantComponent,
    ReservationComponent,
    AdvertismentComponent,
    RestaurantQrcodeComponent,
    RestaurantMenuComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    PerfectScrollbarModule,
    QRCodeModule,
    HttpClientModule,
    ChartsModule,
    NgSelectModule,
    GooglePlaceModule,
    NgbModule,
    NgxImageGalleryModule,
    DropzoneModule,
    FileUploadModule,
    ToastrModule.forRoot({
      timeOut: 2100,
      preventDuplicates: true,
    }),
    LaddaModule,
    // App
    AppRoutingModule,
    LayoutModule,
    FormsModule,
  ],

  providers: [
    Title,
    AppService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
