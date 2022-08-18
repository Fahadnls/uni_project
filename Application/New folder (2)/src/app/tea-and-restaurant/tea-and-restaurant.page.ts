import { Component, OnInit } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AdService } from 'src/services/ad.service';

@Component({
  selector: 'app-tea-and-restaurant',
  templateUrl: './tea-and-restaurant.page.html',
  styleUrls: ['./tea-and-restaurant.page.scss'],
})
export class TeaAndRestaurantPage implements OnInit {
  ads = [];
  user = {
    fullName: '',
  };
  url = environment.baseurl
  constructor(public translateService: TranslateService , public adsServices : AdService ,    public photoViewer: PhotoViewer,) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.adsServices.allAds().subscribe((resp:any)=>{
      this.ads = resp
    })
    this.user = JSON.parse(localStorage.getItem('userData'));
  }
  imageView(item) {
    let image = this.url + item.image;
    this.photoViewer.show(image,);
  }

  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
}
