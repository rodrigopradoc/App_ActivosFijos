import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { DetalleUbicacionPage } from '../../utils/detalle-ubicacion/detalle-ubicacion.page';
import { addIcons } from 'ionicons';
import { eye } from 'ionicons/icons';

@Component({
  selector: 'app-modal-detalle-transferencia',
  templateUrl: './modal-detalle-transferencia.page.html',
  styleUrls: ['./modal-detalle-transferencia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModalDetalleTransferenciaPage implements OnInit {
  public transfer: any;
  public previousEnvironmentDetail: string = '';
  public previousFloor: string = '';

  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    addIcons({ eye })
  }

  ngOnInit() {
    this.transfer = this.navParams.get('transfer')
    console.log(this.transfer);
    this.previousEnvironmentDetail = this.extractEnvironmentDetail(this.transfer.enviromentdetailprevious);
    this.previousFloor = this.extractFloor(this.transfer.enviromentdetailprevious);
  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: DetalleUbicacionPage,
      cssClass: 'ubicacion-modal',
      componentProps: {
        'finallocationid': this.transfer.finallocationid,
      }
    });
    return await modal.present();
  }

  private extractEnvironmentDetail(detail: string): string {
    const parts = detail.split(' - ');
    return parts.slice(1).join(' - ');
  }

  private extractFloor(detail: string): string {
    const parts = detail.split(' - ');
    return parts[0];
  }
}
