import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-qrcode',
  templateUrl: './restaurant-qrcode.component.html',
  styleUrls: ['./restaurant-qrcode.component.scss']
})
export class RestaurantQrcodeComponent implements OnInit {
  qrCodeData;
  restaurantTitle;
  constructor(public active : ActivatedRoute) { }

  ngOnInit() {
    this.qrCodeData = this.active.snapshot.params.code;
    this.restaurantTitle = this.active.snapshot.params.title;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      
      window.print();
    }, 1500);
  }


}
