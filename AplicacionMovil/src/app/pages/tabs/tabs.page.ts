import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, swapHorizontalOutline, addCircleOutline } from 'ionicons/icons';
import { MenuPage } from "./menu/menu.page";

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, MenuPage]
})
export class TabsPage implements OnInit {
  selectedTab: any;

  constructor() { 
    addIcons({ homeOutline, swapHorizontalOutline, addCircleOutline })
  }

  ngOnInit() {
  }

  setCurrentTab(event: any) {
    this.selectedTab = event.tab;
  }
}
