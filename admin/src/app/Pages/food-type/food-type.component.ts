import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../environments/environment";
import { FoodTypeService } from "../../../services/food-type.service";
import { ImageUploadService } from "../../../services/image-upload.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-food-type",
  templateUrl: "./food-type.component.html",
  styleUrls: [
    "./food-type.component.scss",
    "../../../vendor/libs/spinkit/spinkit.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FoodTypeComponent implements OnInit {
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
  editId;
  editIndex = 0;
  editData = {
    type: "",
    icon: "",
    typeArabic: "",
  };
  constructor(
    public foodTypeService: FoodTypeService,
    public imageUploadService: ImageUploadService,
    private appService: AppService,
    private modalService: NgbModal
  ) {
    this.appService.pageTitle = "Food Type";
    this.isRTL = appService.isRTL;

    // if (appService.isRTL) {
    //   this.filterSalesOptions['direction'] = 'rtl';
    //   this.filterPriceOptions['direction'] = 'rtl';
    // }

    this.loadData();
  }
  ngOnInit() {}

  loadData() {
    this.loading = true;
    this.foodTypeService.all_Food_Type().subscribe(
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
      this.editData.icon = resp;
    });
  }
  addClick() {
    this.foodTypeService.add_Food_Type(this.editData).subscribe((resp: any) => {
      this.productsData.push(this.editData);
      this.editData = {
        type: "",
        typeArabic: "",
        icon: "",
      };
      this.modalService.dismissAll();
    });
  }
  editClick() {
    this.productsData[this.editIndex].type = this.editData.type;
    this.productsData[this.editIndex].icon = this.editData.icon;
    this.productsData[this.editIndex].typeArabic = this.editData.typeArabic;
    this.foodTypeService
      .edit_Food_Type(this.editId, this.editData)
      .subscribe((resp: any) => {
        this.editData = {
          type: "",
          icon: "",
          typeArabic: "",
        };
        this.modalService.dismissAll();
      });
  }
  openModal(targetModal, item, index) {
    this.editIndex = index;
    if (item) {
      this.editId = item.id;
      this.editData.type = item.type;
      this.editData.icon = item.icon;
    } else {
      this.editData.type = "";
      this.editData.icon = "";
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
