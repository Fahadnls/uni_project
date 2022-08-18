import { Component, ViewEncapsulation } from "@angular/core";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { EmitterService } from "../services/emitter.service";
import { NotificationService } from "../services/notification.service";
import { SocketService } from "../services/socket.service";
import { AppService } from "./app.service";
import { LayoutService } from "./layout/layout.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [
    ":host { display: block; }",
    "./../vendor/libs/ngx-toastr/ngx-toastr.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  socket = this.socketService.socket;
  restaurantId = 0;
  constructor(
    private router: Router,
    private appService: AppService,
    private layoutService: LayoutService,
    private socketService: SocketService,
    private authService: AuthService,
    public notification: NotificationService,
    public emitter: EmitterService
  ) {
    if (localStorage.getItem("admin-With-love")) {
      if (!this.isAdmin()) {
        this.restaurantId = JSON.parse(
          localStorage.getItem("admin-With-love")
        ).restaurants[0].id;
        this.reservation();
        this.block();
      }
    }

    // Subscribe to router events to handle page transition
    this.router.events.subscribe(this.navigationInterceptor.bind(this));

    // Disable animations and transitions in IE10 to increase performance
    if (
      typeof document["documentMode"] === "number" &&
      document["documentMode"] < 11
    ) {
      const style = document.createElement("style");
      style.textContent = `
        * {
          -ms-animation: none !important;
          animation: none !important;
          -ms-transition: none !important;
          transition: none !important;
        }`;
      document.head.appendChild(style);
    }
  }
  isAdmin() {
    return this.authService.isAdmin();
  }

  reservation() {
    this.socket
      .off("Reservation" + this.restaurantId)
      .on("Reservation" + this.restaurantId, (data) => {
        this.notification.showToast(
          "You got a new reservation from " + data.userName,
          "Incoming Reservation",
          "success"
        );
        this.emitter.newReservation();
      });
  }
  block() {
    let id = JSON.parse(localStorage.getItem("admin-With-love")).id;
    this.authService.blockManager(id).subscribe((resp: any) => {
      if (resp.isBlocked == true) {
        localStorage.clear();
        this.router.navigate(["/"]);
        alert("You are blocked by Super Admin");
      }
    });
  }

  private navigationInterceptor(e: RouterEvent) {
    if (e instanceof NavigationStart) {
      // Set loading state
      document.body.classList.add("app-loading");
    }

    if (e instanceof NavigationEnd) {
      // Scroll to top of the page
      this.appService.scrollTop(0, 0);
    }

    if (
      e instanceof NavigationEnd ||
      e instanceof NavigationCancel ||
      e instanceof NavigationError
    ) {
      // On small screens collapse sidenav
      if (
        this.layoutService.isSmallScreen() &&
        !this.layoutService.isCollapsed()
      ) {
        setTimeout(() => this.layoutService.setCollapsed(true, true), 10);
      }

      // Remove loading state
      document.body.classList.remove("app-loading");
    }
  }
}
