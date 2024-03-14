import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuPage } from "../menu/menu.page";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, MenuPage]
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
