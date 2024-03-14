import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Asset } from 'src/app/modelos/asset.modelos';

@Component({
  selector: 'app-modal-agregar',
  templateUrl: './modal-agregar.page.html',
  styleUrls: ['./modal-agregar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModalAgregarPage implements OnInit {

  @Input() assets: Array<Asset> = [];
  selectedAsset: Asset | null = null;
  filteredItems: Asset[] = [];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.filteredItems = this.assets;
  }

  searchbarInput(event: CustomEvent) {
    let searchTerm = event.detail.value.toLowerCase();
    if (searchTerm === '') {
      this.filteredItems = this.assets;
    } else {
      this.filteredItems = this.assets.filter(asset => asset.assetname.toLowerCase().includes(searchTerm));
    }
  }

  /* isSelected(asset: Asset) {
    return this.selectedAsset === asset;
  } */
  
  radioChange(event: CustomEvent) {
    this.selectedAsset = event.detail.value;
  }

  cancelChanges() {
    this.modalController.dismiss(this.selectedAsset);
  }

  confirmChanges() {
    console.log(this.selectedAsset);
    this.modalController.dismiss(this.selectedAsset);
  }
}