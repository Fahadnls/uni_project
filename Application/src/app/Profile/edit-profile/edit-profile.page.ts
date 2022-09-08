import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { EventEmitterService } from 'src/services/event-emitter.service';
import { ImageUploaderService } from 'src/services/image-uploader.service';
import { ProfileService } from 'src/services/profile.service';
import { ToolService } from 'src/services/tool.service';
import { createTextMaskInputElement } from 'text-mask-core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  Id;
  url = environment.baseurl;
  userData = {
    fullName: '',
    Address: '',
    profileImage: '',
    CNIC: '',
  };
  ProfileImage = '';
  loading= false;
  constructor(
    public imageUploader: ImageUploaderService,
    public eventEmitterService: EventEmitterService,
    public user: ProfileService,
    public tool: ToolService,
    public NavController: NavController,
    public form: FormBuilder,
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
   
    // prettier-ignore
   
  ngOnInit() {}
  ionViewWillEnter() {
    this.Id = JSON.parse(localStorage.getItem('userId'));
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.eventEmitterService.invokeFirstComponentFunction.subscribe(
      (value: any) => {
        this.userData.profileImage = value;
      }
    );
  }
  profileImage() {
    return this.userData.profileImage;
  }
  openCameraOrGallery() {
    this.imageUploader.cameraOrGallery();
  }
  updateBtn() {
    this.loading =true
    this.user.updateProfile(this.Id, this.userData).subscribe((resp: any) => {
      this.loading = false;
      this.tool.presentToast(
          this.dataSuccess.YourProfileSuccessFullyUpdate,
        'success',
        'top'
      );
      this.NavController.back();
    },(err)=>{
      this.loading =false;
    });
  }
}
