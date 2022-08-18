import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { NotificationService } from "../../../services/notification.service";
@Component({
  encapsulation: ViewEncapsulation.Emulated,
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: [
    "./auth.component.scss",
    "../../../vendor/libs/angular2-ladda/angular2-ladda.scss",
    "../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
    "../../../vendor/styles/pages/authentication.scss",
  ],
})
export class AuthComponent implements OnInit {
  loading = false;
  constructor(
    public router: Router,
    public tool: NotificationService,
    public auth: AuthService
  ) {}

  ngOnInit() {}
  manger = false;
  credentials = {
    email: "",
    password: "",
    isAdmin: true,
  };
  onItemChange(value) {
    if (value == "manger") {
      this.credentials.isAdmin = false;
      this.manger = true;
    } else {
      this.credentials.isAdmin = true;
      this.manger = false;
    }
  }
  loginBtn() {
    if ((this.credentials.email && this.credentials.password) == "") {
      alert("Please fill both fields");
    } else {
      this.loading = true;
      this.auth.signIn(this.credentials).subscribe(
        (resp: any) => {
          if (resp.restaurantManger.isBlocked) {
            alert("You are blocked by Super Admin");
          } else {
            if (resp.restaurantManger.isAdmin) {
              localStorage.setItem("adminType-With-love", "SuperAdmin");
            } else {
              localStorage.setItem("adminType-With-love", "Manager");
            }
            localStorage.setItem(
              "admin-With-love",
              JSON.stringify(resp.restaurantManger)
            );
            this.router.navigate(["/dashboard"]);
          }
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          alert(err.error.error);
        }
      );
    }
  }
}
