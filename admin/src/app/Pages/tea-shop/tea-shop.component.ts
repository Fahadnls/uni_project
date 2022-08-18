import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../environments/environment";
import { NotificationService } from "../../../services/notification.service";
import { RestaurantService } from "../../../services/restaurant.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-tea-shop",
  templateUrl: "./tea-shop.component.html",
  styleUrls: [
    "./tea-shop.component.scss",
    "../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
    // '../../../vendor/libs/ngx-toastr/toastr.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TeaShopComponent implements OnInit {
  filterVal = "";
  searchKeys = ["title", "id", "openingTime", "location", "createdAt"];
  currentPage = 1;
  totalItems = 0;
  sortBy = "createdAt";
  sortDesc = true;
  perPage = 10;
  productsData: Object[] = [];
  originalProductsData: Object[] = [];
  isRTL: boolean;
  url = environment.baseUrl;
  loading;
  editId;
  editIndex = 0;
  editData = {
    title: "",
    managerId: 0,
  };
  constructor(
    public restaurantService: RestaurantService,
    private appService: AppService,
    private modalService: NgbModal,
    public notificationService: NotificationService
  ) {
    this.appService.pageTitle = "Coffee shop list";
    this.isRTL = appService.isRTL;

    this.loadData();
  }
  ngOnInit() {}

  addBtn() {
    this.notificationService.showToast("test message", "test title", "error");
  }
  deleteClick() {
    
    this.restaurantService
      .delete_restaurant(this.editId,this.editData.managerId)
      .subscribe((resp: any) => {
        this.productsData.splice(this.editIndex, 1);
        this.notificationService.showToast(
          "Delete restaurant SuccessFully",
          "Restaurant",
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
      this.editData.managerId = item.restaurantMangerId;
    } else {
      this.editData.title = "";
    }
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });
  }

  loadData() {
    this.loading = true;
    this.restaurantService.all_tea_shop().subscribe(
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
