import { Location } from "@angular/common";
import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DropzoneComponent, DropzoneDirective } from "ngx-dropzone-wrapper";
import { GALLERY_CONF, NgxImageGalleryComponent } from "ngx-image-gallery";
import { environment } from "../../../../environments/environment";
import { ImageUploadService } from "../../../../services/image-upload.service";
import { NotificationService } from "../../../../services/notification.service";
import { RestaurantService } from "../../../../services/restaurant.service";
import { AppService } from "../../../app.service";
const Masonry = require("masonry-layout/dist/masonry.pkgd.js");
@Component({
  selector: "app-add-image-restaurant",
  templateUrl: "./add-image-restaurant.component.html",
  styleUrls: [
    "./add-image-restaurant.component.scss",
    "../../../../vendor/libs/ngx-dropzone-wrapper/ngx-dropzone-wrapper.scss",
    "../../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
    "../../../../vendor/libs/ngx-image-gallery/ngx-image-gallery.scss",
  ],
})
export class AddImageRestaurantComponent implements OnInit {
  restaurantImage = {
    restaurantId: 0,
    uploadImages: [],
  };
  restaurantImages = [];
  url = environment.baseUrl;
  isRTL: boolean;
  imagesLoaded = 0;
  private masonry: any;
  private observer: any;
  conf: GALLERY_CONF = {
    imageOffset: "0px",
    imageBorderRadius: "0",
    showDeleteControl: true,
    showImageTitle: true,
  };
  images = [];
  name;
  constructor(
    public location: Location,
    public notification: NotificationService,
    public restaurantService: RestaurantService,
    public imageUploadService: ImageUploadService,
    public appService: AppService,
    public active: ActivatedRoute,
    private zone: NgZone
  ) {
    this.appService.pageTitle = "Add Image";
  }
  @ViewChild(DropzoneDirective) dropzoneInstance: DropzoneDirective;
  @ViewChild("dz") drpzone: DropzoneComponent;
  @ViewChild("galleryContainer") galleryContainer: any;
  @ViewChild(NgxImageGalleryComponent) gallery: NgxImageGalleryComponent;
  ngOnInit() {
    this.restaurantImage.restaurantId = this.active.snapshot.params.id;
    this.name = this.active.snapshot.params.name;
    this.restaurantService
      .restaurant_all_Image(this.restaurantImage.restaurantId)
      .subscribe((resp: any) => {
        this.restaurantImages = resp;
        this.images = resp.map((element) => {
          return {
            id: element.id,
            url: this.url + element.imageUrl,
            title: element.title,
            thumbnailUrl: this.url + element.imageUrl,
            altText: element.title,
          };
        });
      });
  }
  back() {
    this.location.back();
  }
  dropzoneConfig = {
    url: environment.baseUrl + "image/saveImages",
    parallelUploads: 1,
    maxFilesize: 50000,
    filesizeBase: 1000,
    addRemoveLinks: false,
    paramName: "image",
    acceptedFiles: "image/*",
    previewTemplate: `
  <div class="dz-preview dz-file-preview">
    <div class="dz-details">
      <div class="dz-thumbnail">
        <img data-dz-thumbnail>
        <span class="dz-nopreview">No preview</span>
        <div class="dz-success-mark"></div>
        <div class="dz-error-mark"></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>
        <div class="progress">
          <div class="progress-bar progress-bar-primary"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            data-dz-uploadprogress></div>
        </div>
      </div>
      <div class="dz-filename" data-dz-name></div>
      <div class="dz-size" data-dz-size></div>
    </div>
  </div>`,
  };
  onUploadError(err) {
  }
  onUploadSuccess(success) {
    this.restaurantImage.uploadImages.push(success[1]);
  }
  resetBTN() {
    this.dropzoneConfig = {
      url: environment.baseUrl + "image/saveImages",
      parallelUploads: 1,
      maxFilesize: 50000,
      filesizeBase: 1000,
      addRemoveLinks: false,
      paramName: "image",
      acceptedFiles: "image/*",
      previewTemplate: `
    <div class="dz-preview dz-file-preview">
      <div class="dz-details">
        <div class="dz-thumbnail">
          <img data-dz-thumbnail>
          <span class="dz-nopreview">No preview</span>
          <div class="dz-success-mark"></div>
          <div class="dz-error-mark"></div>
          <div class="dz-error-message"><span data-dz-errormessage></span></div>
          <div class="progress">
            <div class="progress-bar progress-bar-primary"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              data-dz-uploadprogress></div>
          </div>
        </div>
        <div class="dz-filename" data-dz-name></div>
        <div class="dz-size" data-dz-size></div>
      </div>
    </div>`,
    };
  }
  assignToRestaurant() {

    this.restaurantService.restaurant_Image(this.restaurantImage).subscribe(
      (resp: any) => {
        this.ngOnInit();
        this.resetBTN();
      },
      (err) => {
      }
    );
  }
  deleteImage(index) {
    this.restaurantService
      .deleteRestaurantImage(this.images[index].id)
      .subscribe((resp: any) => {
        this.ngOnInit();
        this.gallery.close();
      });
  }
  openGallery(i) {
    this.gallery.open(i);
  }
  imgLoaded() {
    if (++this.imagesLoaded === this.images.length) {
      this.initMasonry();
    }
  }
  initMasonry() {
    this.zone.runOutsideAngular(() => {
      this.masonry = new Masonry(this.galleryContainer.nativeElement, {
        originLeft: !this.isRTL,
        transitionDuration: "0.3s",
        itemSelector: ".gallery-thumbnail",
        columnWidth: ".gallery-sizer",
      });

      const MutationObserver =
        window["MutationObserver"] || window["WebKitMutationObserver"];

      if (MutationObserver) {
        /** Watch for any changes to subtree */
        this.observer = new MutationObserver(() => {
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
          }, 30);
        });

        this.observer.observe(this.galleryContainer.nativeElement, {
          subtree: true,
          childList: true,
        });
      }
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.observer) {
        this.observer.disconnect();
      }
      if (this.masonry) {
        this.masonry.destroy();
      }
    });
  }
}
