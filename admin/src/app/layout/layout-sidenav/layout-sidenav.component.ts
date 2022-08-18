import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  HostBinding,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../../services/auth.service";
import { AppService } from "../../app.service";
import { LayoutService } from "../layout.service";

@Component({
  selector: "app-layout-sidenav",
  templateUrl: "./layout-sidenav.component.html",
  styles: [":host { display: block; }"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutSidenavComponent implements AfterViewInit {
  @Input() orientation = "vertical";

  @HostBinding("class.layout-sidenav") private hostClassVertical = false;
  @HostBinding("class.layout-sidenav-horizontal") private hostClassHorizontal =
    false;
  @HostBinding("class.flex-grow-0") private hostClassFlex = false;

  constructor(
    private router: Router,
    private appService: AppService,
    private layoutService: LayoutService,
    private modalService: NgbModal,
    public authService: AuthService,
  ) {
    // Set host classes
    this.hostClassVertical = this.orientation !== "horizontal";
    this.hostClassHorizontal = !this.hostClassVertical;
    this.hostClassFlex = this.hostClassHorizontal;
  }

  ngAfterViewInit() {
    // Safari bugfix
    this.layoutService._redrawLayoutSidenav();
  }

  getClasses() {
    let bg = this.appService.layoutSidenavBg;

    if (
      this.orientation === "horizontal" &&
      (bg.indexOf(" sidenav-dark") !== -1 ||
        bg.indexOf(" sidenav-light") !== -1)
    ) {
      bg = bg
        .replace(" sidenav-dark", "")
        .replace(" sidenav-light", "")
        .replace("-darker", "")
        .replace("-dark", "");
    }

    return `${
      this.orientation === "horizontal" ? "container-p-x " : ""
    } bg-${bg}`;
  }

  isActive(url) {
    return this.router.isActive(url, true);
  }

  isMenuActive(url) {
    return this.router.isActive(url, false);
  }

  isMenuOpen(url) {
    return (
      this.router.isActive(url, false) && this.orientation !== "horizontal"
    );
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }
  openModal(targetModal, item, index) {
    this.toggleSidenav();
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });
  }
  logout() {
    localStorage.clear();
    this.router.navigate(["/"]);
    this.modalService.dismissAll();
  }
  isAdmin() {
    return this.authService.isAdmin();
  }
}
