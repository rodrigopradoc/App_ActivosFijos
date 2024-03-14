import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { AssetService } from 'src/app/services/asset.service';
import { TransferService } from 'src/app/services/transfer.service';
import { ModalActivosTransferenciaPage } from './modal-activos-transferencia/modal-activos-transferencia.page';
import { addIcons } from 'ionicons';
import { swapHorizontalOutline, arrowUpOutline, arrowDownOutline, add, apps, personCircle } from 'ionicons/icons';
import { ModalMasivoTransferenciaPage } from './modal-masivo-transferencia/modal-masivo-transferencia.page';
import { MenuPage } from "../menu/menu.page";
import { ModalDetalleTransferenciaPage } from './modal-detalle-transferencia/modal-detalle-transferencia.page';

@Component({
    selector: 'app-activos-transferencia',
    templateUrl: './activos-transferencia.page.html',
    styleUrls: ['./activos-transferencia.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, MenuPage]
})
export class ActivosTransferenciaPage implements OnInit {
  
  assets: any[] = [];
  transfers: any[] = [];

  constructor(
    private assetService: AssetService,
    private transferService: TransferService,
    private modalController: ModalController
  ) { 
    addIcons({ swapHorizontalOutline, arrowUpOutline, arrowDownOutline, add, apps, personCircle })
  }

  ngOnInit(): void {
    this.listarTransferencias();
  }

  private listarTransferencias(){
    this.transferService.getAllAssetTransfer({}).subscribe({
      next: (data) => {
        this.transfers = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  public async agregarTransferencia() {
    const modal = await this.modalController.create({
      component: ModalActivosTransferenciaPage
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.listarTransferencias();
      }
    });

    return await modal.present();
  }

  public async agregarMasivo() {
    const modal = await this.modalController.create({
      component: ModalMasivoTransferenciaPage
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.listarTransferencias();
      }
    });

    return await modal.present();
  }

  public async verDetalle(transfer: any) {
    const modal = await this.modalController.create({
      component: ModalDetalleTransferenciaPage,
      componentProps: {
        transfer: transfer,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.listarTransferencias(); // Recarga los datos cuando el modal se cierra
      }
    });
  
    return await modal.present();
  }

  public getIconName(transfertype: string): string {
    switch (transfertype) {
      case 'Alta':
        return 'arrow-up-outline';
      case 'Baja':
        return 'arrow-down-outline';
      case 'Reasignación':
        return 'swap-horizontal-outline';
      default:
        return 'home-outline';
    }
  }

  getIconColor(transfertype: string): string {
    switch (transfertype) {
      case 'Alta':
        return 'success';
      case 'Baja':
        return 'danger';
      case 'Reasignación':
        return 'warning';
      default:
        return 'success';
    }
  }
}
