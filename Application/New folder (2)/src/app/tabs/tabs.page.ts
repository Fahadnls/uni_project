import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild('myTabs') tabs: IonTabs;

  constructor() {}

  ngOnInit() {}

  activeTab = 'tea-and-restaurant';

  getSelectedTab(): void {
    this.activeTab = this.tabs.getSelected();
  }
}
