import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuPage } from "../menu/menu.page";

@Component({
    selector: 'app-activos-alta',
    templateUrl: './activos-alta.page.html',
    styleUrls: ['./activos-alta.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, MenuPage]
})
export class ActivosAltaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
