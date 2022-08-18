import { Injectable } from '@angular/core';
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from '@ionic-native/launch-navigator/ngx';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class LocationRouteService {
  constructor(
    private launchNavigator: LaunchNavigator,
    private platform: Platform
  ) {}
  makeDirection(address) {
    let options: LaunchNavigatorOptions = {
      app: this.platform.is('android')
        ? this.launchNavigator.APP.GOOGLE_MAPS
        : this.launchNavigator.APP.APPLE_MAPS,
    };
    this.launchNavigator.navigate(address, options);
  }
}
