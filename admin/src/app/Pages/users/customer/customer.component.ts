import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../../environments/environment";
import { UserService } from "../../../../services/user.service";
import { AppService } from "../../../app.service";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: [
    "./customer.component.scss",
    "../../../../vendor/libs/spinkit/spinkit.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerComponent implements OnInit {
  filterVal = "";
  searchKeys = ["fullName", "id", "phoneNumber", "email", "createdAt"];
  currentPage = 1;
  totalItems = 0;
  sortBy = "createdAt";
  sortDesc = true;
  perPage = 10;
  productsData: Object[] = [];
  originalProductsData = [];
  isRTL: boolean;
  url = environment.baseUrl;
  loading;
  block = {
    isBlocked: "false",
  };
  unblock = {
    isBlocked: "true",
  };
  constructor(
    public userService: UserService,
    private appService: AppService,
    private modalService: NgbModal,

  ) {
    this.appService.pageTitle = "Customer list";
    this.isRTL = appService.isRTL;

    // if (appService.isRTL) {
    //   this.filterSalesOptions['direction'] = 'rtl';
    //   this.filterPriceOptions['direction'] = 'rtl';
    // }

    this.loadData();
  }
  ngOnInit() {}
 
  loadData() {
    this.loading =true
    this.userService.all_user().subscribe((data: any) => {
      this.originalProductsData = data.slice(0);
      setTimeout(() => {
        
        this.loading =false
      }, 1000);
      this.update();
     },err =>{
       this.loading = false;
     }
     );
  }
  blockUser(user, index) {

    this.originalProductsData[index].isBlocked = !user.isBlocked;
    let data = {
      isBlocked: user.isBlocked,
    }
    this.userService.block_user(user.id, data)
      .subscribe((resp: any) => {
      })
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
