import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../../environments/environment";
import { ImageUploadService } from "../../../../services/image-upload.service";
import { NotificationService } from "../../../../services/notification.service";
import { RestaurantService } from "../../../../services/restaurant.service";
import { AppService } from "../../../app.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss',
  "../../../../vendor/libs/spinkit/spinkit.scss",
  "../../../../vendor/libs/ngx-color-picker/ngx-color-picker.scss",
  "../../../../vendor/libs/ngx-toastr/ngx-toastr.scss",

]
})
export class RestaurantMenuComponent implements OnInit {
  filterVal = "";
  searchKeys = ["fullName", "id", "phoneNumber", "email", "createdAt"];
  currentPage = 1;
  totalItems = 0;
  sortBy = "createdAt";
  sortDesc = true;
  perPage = 10;
  productsData = [];
  originalProductsData: Object[] = [];
  isRTL: boolean;
  url = environment.baseUrl;
  loading;
  restaurantId = 0;
  restaurantMenuId = 0;
  restaurantMenuIndex = 0;
  menuDetailsId = 0;
  menuDetailsIndex = 0;
  name;
  menuDetail = {
    title: "",
    image: "",
    price: 0,
    restaurantMenuId: 0,
  };
  restaurantMenuData = {
    title: "",
    restaurantId: 0,
    menu_details: [],
  };
  constructor(
    private modalService: NgbModal,
    private appService: AppService,
    public restaurantService: RestaurantService,
    public notification: NotificationService,
    public imageUploadService: ImageUploadService,
    public active: ActivatedRoute
  ) {
    this.appService.pageTitle = "Restaurant menu";
    this.isRTL = appService.isRTL;
    this.loadData();
  }

  ngOnInit() {}

  loadData() {
    this.restaurantId = this.active.snapshot.params.id
    this.loading = true;
    this.restaurantService.allRestaurantMenu(this.restaurantId).subscribe(
      (data: any) => {
        console.log(data);
        
        this.originalProductsData = data.restaurantMenu.slice(0);
        this.originalProductsData.map((element) => {
          Object.assign(element, { isChecked: true });
        });
        this.loading = false;
        this.update();
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  showTable(i) {
    this.productsData[i].isChecked = !this.productsData[i].isChecked;
  }
  addRestaurantMenuClick() {
    if (this.restaurantMenuData.title == "") {
      this.notification.showToast("error", "Please enter the title", "error");
    } else {
      this.restaurantMenuData.restaurantId = this.restaurantId;
      this.restaurantService.createRestaurantMenu(this.restaurantMenuData).subscribe(
        (resp: any) => {
          this.modalService.dismissAll();
          this.productsData.push(this.restaurantMenuData);
          if (this.originalProductsData.length == 0) {
            this.originalProductsData.push(this.restaurantMenuData);
          }
          this.notification.showToast(
            "Menu",
            "Menu Added SuccessFully",
            "success"
          );
          this.restaurantMenuData = {
            title: "",
            restaurantId :this.restaurantId,
            menu_details: [],
          };
        },
        (err) => {
          this.notification.showToast("error", err.error.error, "error");
        }
      );
    }
  }
  editRestaurantMenuClick() {
    console.log(this.restaurantMenuId);
    console.log(this.restaurantMenuData);
    this.productsData[this.restaurantMenuIndex].title = this.restaurantMenuData.title;
    
    this.restaurantService.editRestaurantMenu(
      this.restaurantMenuId,
      this.restaurantMenuData
    ).subscribe((resp: any) => {
      this.notification.showToast(
        "Menu",
        "Menu Updated SuccessFully",
        "success"
      );
      this.modalService.dismissAll();
    });
  }
  deleteRestaurantMenuClick() {
    console.log(this.restaurantMenuIndex);
    
    this.restaurantService.delRestaurantMenu(this.restaurantMenuId).subscribe(
      (resp: any) => {
        this.notification.showToast(
          "Menu",
          "Menu Deleted SuccessFully",
          "success"
        );

        this.productsData.splice(this.restaurantMenuIndex, 1);
        this.modalService.dismissAll();
      }
    );
  }
  imagePicked(event) {
    let file = event.target.files[0];
    this.imageUploadService.uploadImage(file).subscribe((resp: any) => {
      this.menuDetail.image = resp;
    });
  }
  addSubMenuClick() {
    if ((this.menuDetail.title && this.menuDetail.price && this.menuDetail.image) == "") {
      this.notification.showToast("error", "Please fill all field", "error");
    } else {
      console.log(this.menuDetail);
      console.log(this.restaurantMenuIndex);
      
      this.restaurantService.createMenuDetail(
        this.menuDetail
      ).subscribe((resp: any) => {
        this.productsData[this.restaurantMenuIndex].menu_details.push(
          resp.menuDetail
        );
        this.notification.showToast(
          "Menu",
          "Menu Added SuccessFully",
          "success"
        );
        this.modalService.dismissAll();
      });
    }
  }
  editSubMenuClick() {
    this.productsData[this.restaurantMenuIndex].menu_details[
      this.menuDetailsIndex
    ].title = this.menuDetail.title;
    this.productsData[this.restaurantMenuIndex].menu_details[
      this.menuDetailsIndex
    ].image = this.menuDetail.image;
    this.productsData[this.restaurantMenuIndex].menu_details[
      this.menuDetailsIndex
    ].price = this.menuDetail.price;

    this.restaurantService.editMenuDetail(
      this.menuDetailsId,
      this.menuDetail
    ).subscribe((resp: any) => {
      this.notification.showToast(
        "Menu",
        "Menu updated SuccessFully",
        "success"
      );
      this.modalService.dismissAll();
    });
  }
  delPaymentScheduleBtn(id, ia, i) {
    this.restaurantService.delMenuDetail(id).subscribe((resp: any) => {
      this.notification.showToast(
        "Menu",
        "Menu deleted SuccessFully",
        "success"
      );
      this.productsData[ia].menu_details.splice(i, 1);
    });
  }
  openModal(targetModal, name, item, index1, index2) {
    console.log(item);
    console.log(index1);
    console.log(index2);
    
    this.restaurantMenuIndex = index1;
    this.menuDetailsIndex = index2;
    console.log(name);

    if (name == "menuAdd") {
      this.name = "menuAdd";
    } else {
      this.restaurantMenuData.title = item.title
      if (name == "subMenuAdd") {
        if (item) {
          console.log(item);
          this.name = name;
          this.restaurantMenuId = item.id;
          this.restaurantMenuData.title = item.title;
          this.restaurantMenuData.restaurantId = item.restaurantId;
          this.menuDetail.restaurantMenuId = item.id;
        }
      } else {
        
        if (name == "subMenuEdit") {
          this.name = name;
          this.menuDetail.title = item.title;
          this.menuDetail.price = item.price;
          this.menuDetail.image = item.image;
          this.menuDetail.restaurantMenuId = item.restaurantMenuId;
          this.menuDetailsId = item.id;
        } else {
          this.name = 'subMenuAdd';
        }
      }

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
