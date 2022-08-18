import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
  ) { }
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      duration: 7000,
      mode: 'ios',
      spinner: 'circular',
      translucent: true,
    });
    await loading.present();
  }

  async presentToast(msg, color, position) {
    const toast = await this.toastController.create({
      animated: true,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel',
        }
      ],
      color: color,
      duration: 2700,
      message: msg,
      mode: 'ios',
      position: position,
    });
    toast.present();
  }

  async presentAlert(header, msg, backdropDismiss) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      mode: 'ios',
      translucent: true,
      backdropDismiss: backdropDismiss,
      buttons: ['OK']
    });

    await alert.present();
  }
}
