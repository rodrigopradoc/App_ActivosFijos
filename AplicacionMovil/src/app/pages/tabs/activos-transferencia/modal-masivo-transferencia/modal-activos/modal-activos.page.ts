import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Asset } from 'src/app/modelos/asset.modelos';

@Component({
  selector: 'app-modal-activos',
  templateUrl: './modal-activos.page.html',
  styleUrls: ['./modal-activos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModalActivosPage implements OnInit {
  @Input() assets: Array<Asset> = [];
  @Input() selectedAssets: Array<Asset> = [];
  filteredItems: Asset[] = [];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.filteredItems = this.assets;
    this.selectedAssets = this.selectedAssets || [];
  }

  searchbarInput(event: CustomEvent) {
    let searchTerm = event.detail.value.toLowerCase();
    if (searchTerm === '') {
      this.filteredItems = this.assets;
    } else {
      this.filteredItems = this.assets.filter(asset => asset.assetname.toLowerCase().includes(searchTerm));
    }
  }

  isChecked(asset: Asset) {
    return this.selectedAssets.includes(asset);
  }
  
  checkboxChange(event: CustomEvent, asset: Asset) {
    if (event.detail.checked) {
      this.selectedAssets.push(asset);
    } else {
      let index = this.selectedAssets.indexOf(asset);
      if (index > -1) {
        this.selectedAssets.splice(index, 1);
      }
    }
  }

  cancelChanges() {
    this.modalController.dismiss(this.selectedAssets);;
  }

  confirmChanges() {
    this.modalController.dismiss(this.selectedAssets);
  }
}
