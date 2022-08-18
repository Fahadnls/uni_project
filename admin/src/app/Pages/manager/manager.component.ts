import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../environments/environment";
import { NotificationService } from "../../../services/notification.service";
import { UserService } from "../../../services/user.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-manager",
  templateUrl: "./manager.component.html",
  styleUrls: [
    "./manager.component.scss",
    "../../../vendor/libs/spinkit/spinkit.scss",
    "../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerComponent implements OnInit {
  filterVal = "";
  searchKeys = ["fullName", "id", "email", "createdAt"];
  currentPage = 1;
  totalItems = 0;
  sortBy = "createdAt";
  sortDesc = true;
  perPage = 10;
  productsData = [];
  originalProductsData = [];
  isRTL: boolean;
  url = environment.baseUrl;
  loading;
  editId;
  editIndex = 0;
  editData = {
    fullName: "",
    email: "",
    password: "",
  };
  constructor(
    private mangerService: UserService,
    private appService: AppService,
    private modalService: NgbModal,
    public notification: NotificationService
  ) {
    this.appService.pageTitle = "Manger list";
    this.isRTL = appService.isRTL;

    // if (appService.isRTL) {
    //   this.filterSalesOptions['direction'] = 'rtl';
    //   this.filterPriceOptions['direction'] = 'rtl';
    // }

    this.loadData();
  }
  blockUser(user, index) {

    this.originalProductsData[index].isBlocked = !user.isBlocked;
    let data = {
      isBlocked: user.isBlocked,
    }
    this.mangerService.block_manger(user.id, data)
      .subscribe((resp: any) => {
      })
  }
  ngOnInit() {}
  async updateManger() {
    await this.mangerService
      .update_manger(this.editId, this.editData)
      .subscribe(
        (resp: any) => {
          this.productsData[this.editIndex].fullName = this.editData.fullName;
          this.productsData[this.editIndex].email = this.editData.email;
          this.notification.showToast(
            "Restaurant Manger",
            "Update Manger Successfully",
            "success"
            );
            this.modalService.dismissAll();
            this.editData = {
              fullName: "",
              email: "",
              password: "",
            };
        },
        (err) => {

          if (err.error.error == "email already in use!")
            this.notification.showToast(
              "email already in use!",
              "Restaurant Manger",
              "error"
            );
          else if (
            err.error.error == "Password should be greater than 6 characters!"
          )
            this.notification.showToast(
              "Password should be greater than 6 characters!",
              "Restaurant Manger",
              "error"
            );
        }
      );
  }

  async registerManger() {
    if (
      (this.editData.fullName &&
        this.editData.email &&
        this.editData.password) == ""
    ) {
      this.notification.showToast(
        "Please fill the All fields",
        "Restaurant Manger",
        "error"
      );
    } else {
      await this.mangerService.register_manger(this.editData).subscribe(
        (resp: any) => {
          this.productsData.push(resp.restaurantManger);
          this.editData = {
            fullName: "",
            email: "",
            password: "",
          };
          this.notification.showToast(
            "Restaurant Manger",
            "Added Manger Successfully",
            "success"
          );
          this.modalService.dismissAll();
        },
        (err) => {
          if (err.error.error == "Email already Exits!")
            this.notification.showToast(
              "Email already Exits!",
              "Restaurant Manger",
              "error"
            );
          else if (
            err.error.error == "Password should be greater than 6 characters!"
          )
            this.notification.showToast(
              "Password should be greater than 6 characters!",
              "Restaurant Manger",
              "error"
            );
        }
      );
    }
  }

  loadData() {
    this.loading = true;
    this.mangerService.all_manger().subscribe(
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
  openModal(targetModal, item, index) {
    this.editIndex = index;
    if (item) {
      this.editId = item.id;
      this.editData.fullName = item.fullName;
      this.editData.email = item.email;
      this.editData.password = "";
    } else {
      this.editData.password = "";
      this.editData.fullName = "";
      this.editData.email = "";
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
