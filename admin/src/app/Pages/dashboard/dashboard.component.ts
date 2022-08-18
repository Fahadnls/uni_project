import {
  Component,
  ViewChildren,
  QueryList,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { AppService } from "../../app.service";
import { ChartDataSets, ChartOptions } from "chart.js";
import { BaseChartDirective } from "ng2-charts/ng2-charts";
import { DashboardService } from "../../../services/dashboard.service";
import { AuthService } from "../../../services/auth.service";
import { EmitterService } from "../../../services/emitter.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: [
    "./dashboard.component.scss",
    "../../../vendor/libs/spinkit/spinkit.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  public chartOptions: Partial<ChartOptions>;

  loading: boolean;
  dashboardData = {
    totalUsers: 0,
    totalManagers: 0,
    totalRestaurants: 0,
    totalTeaShop: 0,
    totalReservations: 0,
    reservedReservation: 0,
    completedReservations: 0,
    cancelledReservation: 0,
    reservedArray: [3, 20, 6],
    getFiveReservations: [],
  };
  restaurantId = 0;
  constructor(
    private appService: AppService,
    private dashboardService: DashboardService,
    public authService: AuthService,
    public emitter: EmitterService,
  ) {
    this.appService.pageTitle = "Dashboard";
  }

  ngOnInit() {
    if (!this.isAdmin()) {
      this.restaurantId = JSON.parse(
        localStorage.getItem("admin-With-love")
      ).restaurants[0].id;
      
      this.emitter.refreshReservation.subscribe((resp:any)=>{
        this.getRestaurantDashboardData();
      })
      this.getRestaurantDashboardData()
    }else{
      this.getAdminDashboardData();
    }
  }

  getAdminDashboardData() {
    this.loading = true;
    this.dashboardService.get_Dashboard_Data_For_Super_Admin().subscribe(
      (resp: any) => {
        this.loading = false;
        this.dashboardData = resp;
        this.configChart();
      },
      (err) => {
        this.loading = false;
        this.configChart();
      }
    );
  }
  getRestaurantDashboardData() {
    this.loading = true;
    this.dashboardService.get_Dashboard_Data_For_restaurant(this.restaurantId).subscribe(
      (resp: any) => {
        this.loading = false;
        this.dashboardData = resp;
        this.configChart();
      },
      (err) => {
        this.loading = false;
        this.configChart();
      }
    );
  }
  isAdmin() {
    return this.authService.isAdmin();
  }

  configChart() {
    this.chart6Data = [
      {
        data: this.dashboardData.reservedArray,
        borderWidth: 1,
      },
    ];
  }

  //chart6Data
  chart6Data = [
    {
      data: [1, 1, 1],
      borderWidth: 1,
    },
  ];
  chart6Options = {
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    legend: {
      position: "right",
      labels: {
        boxWidth: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  chart6Colors = [
    {
      backgroundColor: [
        "rgba(255, 193, 7, 0.5)",
        "rgba(25, 135, 84, 0.5)",
        "rgba(220, 53, 69, 0.5)",
      ],
      borderColor: ["#ffc107", "#198754", "#dc3545"],
    },
  ];

  //chart1Data
  chart1Data = [
    {
      label: "Active",
      data: [23, 25, 95, 59, 46, 68, 4, 41],
      borderWidth: 1,
    },
    {
      label: "Blocked",
      data: [53, 1, 43, 28, 56, 52, 50, 66],
      borderWidth: 1,
      borderDash: [5, 5],
    },
  ];
  chart1Options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: "#aaa",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: "#aaa",
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  chart1Colors = [
    {
      backgroundColor: "rgba(28,180,255,.05)",
      borderColor: "rgba(28,180,255,1)",
    },
    {
      backgroundColor: "rgba(220, 53, 69, 0.1)",
      borderColor: "#dc3545",
    },
  ];
}
