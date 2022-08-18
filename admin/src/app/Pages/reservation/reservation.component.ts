import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../environments/environment";
import { AppService } from "../../app.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { RestaurantService } from "../../../services/restaurant.service";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../../services/notification.service";
import { Location } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { EmitterService } from "../../../services/emitter.service";
@Component({
  selector: "app-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: [
    "./reservation.component.scss",
    "../../../vendor/libs/spinkit/spinkit.scss",
    "../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss",
    "../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ReservationComponent implements OnInit {
  isIE10 = false;
  id = 0;
  url = environment.baseUrl;

  loading = false;
  page: number = 1;
  activeTab = "Reserved";
  pendingReservation = [];
  CompletedReservation = [];
  cancelReservation = [];
  editId;
  editIndex = 0;
  editData = {
    bookingCode: "",
    status: "Cancel",
    cancelReason: "",
    cancelBy: "Manager",
  };

  completedData = {
    status: "Completed",
  };
  restaurantId = 0;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    public reservation: RestaurantService,
    public active: ActivatedRoute,
    public notification: NotificationService,
    public location: Location,
    public authService: AuthService,
    public emitter:EmitterService,
  ) {
    this.appService.pageTitle = "Reservation";
    this.isIE10 = this.appService.isIE10;
  }

  ngOnInit() {
    this.id = this.active.snapshot.params.id;
    this.pendingReservation = [];
    this.CompletedReservation = [];
    this.cancelReservation = [];
    if (!this.isAdmin()) {
      this.restaurantId = JSON.parse(
        localStorage.getItem("admin-With-love")
        ).restaurants[0].id;
        this.emitter.refreshReservation.subscribe((resp:any)=>{
          this.loadData();
        })
    }
    this.loadData();
  }

  back() {
    this.location.back();
  }
  isAdmin() {
    return this.authService.isAdmin();
  }

  loadData() {
    this.loading = true;
    if (this.isAdmin()) {
      this.reservation
        .restaurant_reservation(this.id)
        .subscribe((resp: any) => {
          this.pendingReservation = resp.pendingReservation;
          this.CompletedReservation = resp.CompletedReservation;
          this.cancelReservation = resp.cancelledReservation;
          this.loading = false;
        });
    } else {
      this.reservation
        .restaurant_reservation(this.restaurantId)
        .subscribe((resp: any) => {
          this.pendingReservation = resp.pendingReservation;
          this.CompletedReservation = resp.CompletedReservation;
          this.cancelReservation = resp.cancelledReservation;
          this.loading = false;
        });
    }
  }
  cancelBtn() {
    if (this.editData.cancelReason == "") {
      this.notification.showToast(
        "Please enter Reason Why cancel this reservation",
        "Cancel Reservation",
        "error"
      );
    } else {
      this.reservation
        .cancel_reservation(this.editId, this.editData)
        .subscribe((resp: any) => {
          this.pendingReservation.splice(this.editIndex, 1);
          let data = {
            data: 0,
          };
          this.cancelReservation.push(data);
          this.modalService.dismissAll();
        });
    }
  }
  completed(item, i) {
    this.reservation
      .cancel_reservation(item.id, this.completedData)
      .subscribe((resp: any) => {
        this.pendingReservation.splice(i, 1);
        let data = {
          data: 0,
        };
        this.CompletedReservation.push(data);
        this.modalService.dismissAll();
      });
  }

  openModal(targetModal, item, index) {
    this.editIndex = index;
    if (item) {
      this.editId = item.id;
      this.editData.bookingCode = item.tableBookingCode;
    }
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });
  }

  differenceBetweenTwoDates(expiryDate) {
    let date1: any = new Date();
    let date2: any = new Date(expiryDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  tabChange(active) {
    this.activeTab = active;
    this.loadData();
  }

  approved(item) {
    Swal(
      {
        title: "Approved?",
        text: "User approved for subscription",
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#42ba96",
        confirmButtonText: "OK",
        closeOnConfirm: true,
      },
      (confirmed) => {
        if (confirmed) {
          // Do what ever when the user click on the 'Yes, delete it' button
        }
      }
    );
  }

  declined() {
    Swal(
      {
        title: "Declined?",
        text: "Subscription is declined",
        type: "error",
        showCancelButton: false,
        confirmButtonColor: "#df4759",
        confirmButtonText: "OK",
        closeOnConfirm: true,
      },
      (confirmed) => {
        if (confirmed) {
          // Do what ever when the user click on the 'Yes, delete it' button
        }
      }
    );
  }
}
