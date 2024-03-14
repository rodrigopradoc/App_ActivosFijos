import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, IonicModule, ModalController, NavParams } from '@ionic/angular';
import { AssetService } from 'src/app/services/asset.service';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { TrasladosService } from 'src/app/services/traslados.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { CentrosCostoService } from 'src/app/services/centros-costo.service';
import { TransferService } from 'src/app/services/transfer.service';
import { CostCenter } from 'src/app/modelos/cost-center.modelos';
import { DetailMaster } from 'src/app/modelos/master.interface';
import { Location } from 'src/app/modelos/location.modelos';
import { Project } from 'src/app/modelos/project.modelos';
import { Asset } from 'src/app/modelos/asset.modelos';
import { AssetTransfer } from 'src/app/modelos/asset-transfer.modelos';
import { ModalAgregarPage } from './modal-agregar/modal-agregar.page';
import { ModalUbicacionPage } from '../../utils/modal-ubicacion/modal-ubicacion.page';
import { addIcons } from 'ionicons';
import { add, swapHorizontalOutline } from 'ionicons/icons';

@Component({
  selector: 'app-modal-activos-transferencia',
  templateUrl: './modal-activos-transferencia.page.html',
  styleUrls: ['./modal-activos-transferencia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ModalActivosTransferenciaPage implements OnInit {
  public assets: Array<Asset> = [];
  public activoSeleccionado: Asset | null = null;
  public ubicacionSeleccionada!: Location;
  public projects: Array<Project> = [];
  public transferTypes: Array<DetailMaster> = [];
  public costCenters: Array<CostCenter> = [];
  public locations: Array<Location> = [];
  public transferForm : UntypedFormGroup = new UntypedFormGroup({});
  private transfer: any;
  public idActivo: any;
  public nombreActivo: any;

  constructor(
    private modalController: ModalController,
    private assetService: AssetService,
    private proyectosService: ProyectosService,
    private trasladosService: TrasladosService,
    private centrosCostoService: CentrosCostoService,
    private ubicacionesService: UbicacionesService,
    private transferService: TransferService,
    private builder: UntypedFormBuilder,
    private alertController: AlertController
  ) {
    addIcons({ add, swapHorizontalOutline })
  }

  ngOnInit() {
    this.crearFormulario();
    this.listarTodo();
    this.obtenerFechaHoraActual();
  }

  private crearFormulario() {
    this.transferForm = this.builder.group({
      assetname: [{ value: '', disabled: false}, [Validators.required]],
      previouslocation: [{ value: '', disabled: false}, []],
      previouscostcenter: [{ value: '', disabled: false}, []],
      finallocation: [{ value: '', disabled: false}, [Validators.required]],
      transfertype: [{ value: '', disabled: false}, [Validators.required]],
      finalcostcenter: [{ value: '', disabled: false}, []],
      project: [{ value: '', disabled: false}, [Validators.required]],
      companylocalprevious: [{ value: '', disabled: false}, []],
      areaprevious: [{ value: '', disabled: false}, []],
      enviromentdetailprevious: [{ value: '', disabled: false}, []],
      floorprevious: [{ value: '', disabled: false}, []],
      companylocalfinal: [{ value: '', disabled: false}, []],
      areafinal: [{ value: '', disabled: false}, []],
      enviromentdetailfinal: [{ value: '', disabled: false}, []],
      floorfinal: [{ value: '', disabled: false}, []],
  
      additionalInformation: [{ value: '', disabled: false}, []],
      approvalUserId: [{ value: null, disabled: false}, []],
      approvedFlag: [{ value: false, disabled: false}, []],
      assetId: [{ value: null, disabled: false}, [Validators.required]],
      code: [{ value: 'T', disabled: false}, []],
      finalLocationId: [{ value: null, disabled: false}, [Validators.required]],
      previousLocationId: [{ value: null, disabled: false}, []],
      projectId: [{ value: null, disabled: false}, [Validators.required]],
      transferResponsibleId: [{ value: 1, disabled: false}, []],
      transferTypeId: [{ value: null, disabled: false}, [Validators.required]],
      datetransfer: [{ value: new Date(), disabled: false}, []],
      hourtransfer: [{ value: new Date(), disabled: false}, []],
    });  
  }

  private listarTodo() {
    this.centrosCostoService.findRealAll().subscribe({
      next: (data) => {
        this.costCenters = data;
        this.ubicacionesService.getAll().subscribe({
          next: (data) => {
            this.locations = data;
            this.proyectosService.getProjects().subscribe({
              next: (data) => {
                this.projects = data;
                this.assetService.getAssets().subscribe({
                  next: (data) => {
                    this.assets = data;
                    console.log(this.assets);
                    this.trasladosService.getTypes().subscribe({
                      next: (data) => {
                        this.transferTypes = data;
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                  },
                  error: (error) => {
                    console.error(error);
                  }
                });
              },
              error: (error) => {
                console.error(error);
              }
            });
          },
          error: (error) => {
            console.error(error);
          }
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  public onLocationChange(event: CustomEvent) {
    const selectedId = event.detail.value;
    const selectedLocation = this.locations.find(location => location.id === selectedId);
  
    if (selectedLocation) {
      this.transferForm.get('finalLocationId')?.setValue(selectedId);
      this.transferForm.get('finallocation')?.setValue(selectedLocation.name);
    }
  }

  public onTransferChange(event: CustomEvent) {
    const selectedId = event.detail.value;
    const selectedTransferType = this.transferTypes.find(ttype => ttype.id === selectedId);
  
    if (selectedTransferType) {
      this.transferForm.get('transferTypeId')?.setValue(selectedId);
      this.transferForm.get('transfertype')?.setValue(selectedTransferType.name);
    }
  }

  public onProjectChange(event: CustomEvent) {
    const selectedId = event.detail.value;
    const selectedProject = this.projects.find(project => project.id === selectedId);
  
    if (selectedProject) {
      this.transferForm.get('projectId')?.setValue(selectedId);
      this.transferForm.get('project')?.setValue(selectedProject.name);
    }
  }

  public async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalAgregarPage,
      componentProps: {
        'assets': this.assets,
        'selectedAsset': this.activoSeleccionado,
      }
    });
  
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null) {
        this.activoSeleccionado = dataReturned.data;
        this.seleccionarActivo(this.activoSeleccionado);
      } else {
        this.resetearActivo();
      }
    });
  
    return await modal.present();
  }

  public async elegirUbicacion() {
    const modal = await this.modalController.create({
      component: ModalUbicacionPage,
      cssClass: 'ubicacion-modal-elegir',
      componentProps: {
        'selectedLocation': this.ubicacionSeleccionada,
      }
    });
  
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null) {
        this.ubicacionSeleccionada = dataReturned.data;
        this.camposUbicacion(this.ubicacionSeleccionada);
        console.log(this.ubicacionSeleccionada);
      }
    });
  
    return await modal.present();
  }

  private camposUbicacion(ubicacion: Location) {
    if (ubicacion) {
      const officeNumber = ubicacion.enviroment.officeNumber;
      const planeCode = ubicacion.enviroment.planeCode;
      const formattedDetail = `Of. ${officeNumber} - ${planeCode}`;
      this.transferForm.get('finalLocationId')?.setValue(ubicacion.id);
      this.transferForm.get('finallocation')?.setValue(ubicacion.name);
      this.transferForm.get('companylocalfinal')?.setValue(ubicacion.companyLocal.name);
      this.transferForm.get('areafinal')?.setValue(ubicacion.area.name);
      this.transferForm.get('enviromentdetailfinal')?.setValue(formattedDetail);
      this.transferForm.get('floorfinal')?.setValue(ubicacion.enviroment.floor);
    }
  }

  private seleccionarActivo(activo: any) { 
    const selectedAsset = this.assets.find(asset => asset.assetid === activo.assetid);
    if (selectedAsset) {
      console.log(selectedAsset);
      this.transferForm.get('assetId')?.setValue(selectedAsset.assetid);
      this.transferForm.get('assetname')?.setValue(selectedAsset.assetname);
      this.transferForm.get('previousLocationId')?.setValue(selectedAsset.locationid);
      this.transferForm.get('previouslocation')?.setValue(selectedAsset.locationname);
      this.transferForm.get('previouscostcenter')?.setValue(selectedAsset.costcentername);
      this.transferForm.get('companylocalprevious')?.setValue(selectedAsset.companylocal);
      this.transferForm.get('areaprevious')?.setValue(selectedAsset.area);
      this.transferForm.get('enviromentdetailprevious')?.setValue(selectedAsset.enviroment);
      this.transferForm.get('floorprevious')?.setValue(selectedAsset.floor);
    }
  }

  private resetearActivo() {
    this.activoSeleccionado = null;
    this.transferForm.get('assetId')?.setValue(null);
    this.transferForm.get('assetname')?.setValue('');
    this.transferForm.get('previousLocationId')?.setValue(null);
    this.transferForm.get('previouslocation')?.setValue('');
    this.transferForm.get('previouscostcenter')?.setValue('');
    this.transferForm.get('companylocalprevious')?.setValue('');
    this.transferForm.get('areaprevious')?.setValue('');
    this.transferForm.get('enviromentdetailprevious')?.setValue('');
  }

  cancelar() {
    this.modalController.dismiss(null, 'cancel');
  }

  public async guardar() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Quieres guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Guardar',
          handler: () => {
            const transferencia: AssetTransfer = {
              additionalInformation: this.transferForm.get('additionalInformation')?.value,
              approvalUserId: this.transferForm.get('approvalUserId')?.value,
              approvedFlag: this.transferForm.get('approvedFlag')?.value,
              assetId: this.transferForm.get('assetId')?.value,
              code: 'T' + this.obtenerFechaHoraActual(),
              finalLocationId: this.transferForm.get('finalLocationId')?.value,
              previousLocationId: this.transferForm.get('previousLocationId')?.value,
              projectId: this.transferForm.get('projectId')?.value,
              transferResponsibleId: this.transferForm.get('transferResponsibleId')?.value,
              transferTypeId: this.transferForm.get('transferTypeId')?.value,
              dateTransfer: this.formatDateToYYYYMMDD(this.transferForm.get('datetransfer')?.value),
              hourTransfer: this.formatDateToHHMM(this.transferForm.get('hourtransfer')?.value),
            }
            this.transferService.saveTransfer(transferencia).subscribe(response => {
              console.log('Respuesta del servidor:', response);
              this.modalController.dismiss({reload: true});
            });
            //console.log(transferencia);
          }
        }
      ]
    });
    await alert.present();
  }

  obtenerFechaHoraActual(): string {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const día = ahora.getDate().toString().padStart(2, '0');
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const formato = `${año}${mes}${día}${horas}${minutos}`;
    return formato;
  }

  formatDateToYYYYMMDD(date: Date): string {
    if(!date){
      return '';
    }
    const year = date.getFullYear();
    const month = this.padNumber(date.getMonth() + 1);
    const day = this.padNumber(date.getDate());

    return `${year}-${month}-${day}`;
  }

  formatDateToHHMM(date: Date): string {
    if (!date) {
      return '';
    }
    const hour = this.padNumber(date.getHours());
    const minute = this.padNumber(date.getMinutes());
  
    return `${hour}:${minute}`;
  }

  private padNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
