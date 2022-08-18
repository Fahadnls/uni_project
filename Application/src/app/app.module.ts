import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';
import { EventEmitterService } from 'src/services/event-emitter.service';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { CalendarModule } from 'ion2-calendar';
import { CodeInputModule } from 'angular-code-input';
import { fancyAnimation } from './animations';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { Calendar } from '@ionic-native/calendar/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from '../services/translate-config.service';
import { Network } from '@ionic-native/network/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
firebase.initializeApp(environment.firebaseConfig);
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    NgxIntlTelInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicHeaderParallaxModule,
    HttpClientModule,
    IonicModule.forRoot({
      navAnimation: fancyAnimation,
    }),
    AppRoutingModule,
    CalendarModule,
    CodeInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    EventEmitterService,
    FileTransfer,
    File,
    Calendar,
    PhotoViewer,
    Camera,
    LocalNotifications,
    Network,
    OpenNativeSettings,
    BarcodeScanner,
    LaunchNavigator,
    FirebaseAuthentication,
    AndroidPermissions,
    Geolocation,
    TranslateConfigService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
