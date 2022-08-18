import { EventEmitterService } from './event-emitter.service';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ToolService } from './tool.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ImageUploaderService {
  constructor(
    private camera: Camera,
    private transfer: FileTransfer,
    public androidPermissions: AndroidPermissions,
    public alertController: AlertController,
    public tool: ToolService,
    public http: HttpClient,
    public eventEmitterService: EventEmitterService,
    public translateService: TranslateService,
    ) {
      translateService.get('dataSuccess').subscribe((resp: any) => {
        this.dataSuccess = resp;
      });
      translateService.get('dataError').subscribe((resp: any) => {
        this.dataError = resp;
      });
    }
    dataSuccess: any;
    dataError: any;

  url = environment.baseurl;
  
  imageUpload(imagePath) {
    const fd = new FormData();
    fd.append("image", imagePath);
    return this.http.post(this.url + "image/saveImages", fd);
  };

  async cameraOrGallery() {
    const alert = await this.alertController.create({
      header: this.dataSuccess.UploadImage,
      message: this.dataSuccess.PleaseChooseCameraOrGallery,
      mode: 'ios',
      buttons: [
        {
          text: this.dataSuccess.Gallery,
          handler: () => {
            this.Image('gallery');
          },
        },
        {
          text: this.dataSuccess.Camera,
          handler: () => {
            this.Image('camera');
          },
        },
      ],
    });

    await alert.present();
  }

  async Image(type) {
    await this.tool.presentLoading(this.dataSuccess.PleaseWait + '...');
    const options: CameraOptions = {
      quality: 50,
      correctOrientation: true,
      allowEdit: false,
      targetWidth: 400,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    if (type == 'gallery') {
      options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    } else if (type == 'camera') {
      options.sourceType = this.camera.PictureSourceType.CAMERA;
    }

    await this.camera.getPicture(options).then(
      (imageData) => {
        if (type == 'gallery') {
          this.askPermission(imageData);
        } else {
          this.uploadFile(imageData);
        }
      },
      (err) => {
        // Handle error
        this.tool.loadingController.dismiss();
      }
    );
  }

  uploadFile(fPath) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'image',
      httpMethod: 'POST',
    };
    let url = this.url + 'image/saveImages';
    fileTransfer.upload(fPath, url, options, true).then(
      (data) => {
       
        
        if (JSON.parse(data.response)) {
          let fname = JSON.parse(data.response);
         
          this.eventEmitterService.onFirstComponentButtonClick(fname);
        } else {
          // this.actionFunctionsService.presentToast(JSON.parse(data.response).details, 'danger')
        }
        // this.actionFunctionsService.dismissLoading();
      },
      (err) => {
        // this.actionFunctionsService.dismissLoading();
        // this.actionFunctionsService.presentToast("Error Occurred while uploading image", 'danger')
      }
    );
  }

  askPermission(fPath) {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(
        (result) => {
          if (result.hasPermission) {
            // code
            this.uploadFile(fPath);
          } else {
            this.androidPermissions
              .requestPermission(
                this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
              )
              .then((result) => {
                if (result.hasPermission) {
                  // code
                  this.uploadFile(fPath);
                }
              });
          }
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
          )
      );
  }
}
