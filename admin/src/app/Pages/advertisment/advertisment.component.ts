import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { AdvertismentService } from '../../../services/advertisment.service';
import { ImageUploadService } from '../../../services/image-upload.service';
import { NotificationService } from '../../../services/notification.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-advertisment',
  templateUrl: './advertisment.component.html',
  styleUrls: ['./advertisment.component.scss', "../../../vendor/libs/ngx-toastr/ngx-toastr.scss"]
})
export class AdvertismentComponent implements OnInit {

  filterVal = "";
  searchKeys = ["title", "createdAt"];
  currentPage = 1;
  totalItems = 0;
  sortBy = "createdAt";
  sortDesc = true;
  perPage = 10;
  productsData = [];
  originalProductsData: Object[] = [];
  url = environment.baseUrl;
  loading;
  editId;
  editIndex = 0;
  editData = {
    title: "",
    description: "",
    image: "",
    url: "",
  };
  constructor(
    public adsService: AdvertismentService,
    public imageUploadService: ImageUploadService,
    private appService: AppService,
    private modalService: NgbModal,
    public notificationService: NotificationService
  ) {
    this.appService.pageTitle = "Advertisement";
    this.loadData();
  }
  ngOnInit() {}

  loadData() {
    this.loading = true;
    this.adsService.all_advertisement().subscribe(
      (data: any) => {
        this.originalProductsData = data.slice(0);
        this.loading = false;
        this.update();
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  imagePicked(event) {
    let file = event.target.files[0];
    this.imageUploadService.uploadImage(file).subscribe((resp: any) => {
      this.editData.image = resp;
    });
  }
  addClick() {
    this.adsService.add_advertisement(this.editData).subscribe((resp: any) => {
      this.productsData.push(this.editData);
      this.editData = {
        title: "",
        description: "",
        image: "",
        url: "",
      };
      this.modalService.dismissAll();
    });
  }
  editClick() {
    // this.productsData[this.editIndex].title = this.editData.title;
    this.productsData[this.editIndex].image = this.editData.image;
    this.productsData[this.editIndex].url = this.editData.url;
    // this.productsData[this.editIndex].description = this.editData.description;
    this.adsService
      .edit_advertisement(this.editId, this.editData)
      .subscribe((resp: any) => {
        this.editData = {
          title: "",
          image: "",
          description: "",
          url: "",
        };
        this.modalService.dismissAll();
      });
  }
  deleteClick() {
    this.adsService.del_advertisement(this.editId).subscribe((resp: any) => {
      this.productsData.splice(this.editIndex, 1);
      this.notificationService.showToast(
        "Delete Ads SuccessFully",
        "Ads",
        "success"
      );
      this.modalService.dismissAll();
    });
  }
  openModal(targetModal, item, index) {
    this.editIndex = index;
    if (item) {
      this.editId = item.id;
      this.editData.title = item.title;
      this.editData.image = item.image;
      this.editData.url = item.url;
    } else {
      this.editData.title = "";
      this.editData.url = "";
      this.editData.image = "";
    }
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });
  }
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  update() {
    const data = this.filter(this.originalProductsData);
    this.totalItems = data.length;
    this.sort(data);
    this.productsData = this.paginate(data);
  }
  filter(data) {
    const filter = this.filterVal.toLowerCase();
    return !filter
      ? data.slice(0)
      : data.filter((d) => {
          return (
            Object.keys(d)
              .filter((k) => this.searchKeys.includes(k))
              .map((k) => String(d[k]))
              .join("|")
              .toLowerCase()
              .indexOf(filter) !== -1 || !filter
          );
        });
  }
  sort(data) {
    data.sort((a: any, b: any) => {
      a =
        typeof a[this.sortBy] === "string"
          ? a[this.sortBy].toUpperCase()
          : a[this.sortBy];
      b =
        typeof b[this.sortBy] === "string"
          ? b[this.sortBy].toUpperCase()
          : b[this.sortBy];

      if (a < b) {
        return this.sortDesc ? 1 : -1;
      }
      if (a > b) {
        return this.sortDesc ? -1 : 1;
      }
      return 0;
    });
  }
  paginate(data) {
    const perPage = parseInt(String(this.perPage), 10);
    const offset = (this.currentPage - 1) * perPage;

    return data.slice(offset, offset + perPage);
  }
  setSort(key) {
    if (this.sortBy !== key) {
      this.sortBy = key;
      this.sortDesc = false;
    } else {
      this.sortDesc = !this.sortDesc;
    }

    this.currentPage = 1;
    this.update();
  }
}
