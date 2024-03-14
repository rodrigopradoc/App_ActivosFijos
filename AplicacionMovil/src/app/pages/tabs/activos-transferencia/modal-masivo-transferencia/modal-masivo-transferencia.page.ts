import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { AssetService } from 'src/app/services/asset.service';
import { TransferService } from 'src/app/services/transfer.service';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { TrasladosService } from 'src/app/services/traslados.service';
import { CentrosCostoService } from 'src/app/services/centros-costo.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { Location } from 'src/app/modelos/location.modelos';
import { CostCenter } from 'src/app/modelos/cost-center.modelos';
import { DetailMaster } from 'src/app/modelos/master.interface';
import { Project } from 'src/app/modelos/project.modelos';
import { Asset } from 'src/app/modelos/asset.modelos';
import { AssetTransfer } from 'src/app/modelos/asset-transfer.modelos';
import { ModalActivosPage } from './modal-activos/modal-activos.page';
import { removeCircleOutline, swapHorizontalOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { ModalUbicacionPage } from '../../utils/modal-ubicacion/modal-ubicacion.page';

@Component({
  selector: 'app-modal-masivo-transferencia',
  templateUrl: './modal-masivo-transferencia.page.html',
  styleUrls: ['./modal-masivo-transferencia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ModalMasivoTransferenciaPage implements OnInit {
  public activoSeleccionado: any;
  public activosSeleccionados: Asset[] = [];
  public ubicacionSeleccionada!: Location;
  public assets: Array<Asset> = [];
  public projects: Array<Project> = [];
  public transferTypes: Array<DetailMaster> = [];
  public costCenters: Array<CostCenter> = [];
  public locations: Array<Location> = [];
  public masivoForm : UntypedFormGroup = new UntypedFormGroup({});


  constructor(
    private modalController: ModalController,
    private builder: UntypedFormBuilder,
    private assetService: AssetService,
    private proyectosService: ProyectosService,
    private trasladosService: TrasladosService,
    private centrosCostoService: CentrosCostoService,
    private ubicacionesService: UbicacionesService,
    private transferService: TransferService,
    private alertController: AlertController
  ) { 
    addIcons({ removeCircleOutline, add, swapHorizontalOutline})
  }

  ngOnInit() {
    this.listarTodo();
    this.obtenerFechaHoraActual();
    this.crearFormulario();
  }

  private crearFormulario() {
    this.masivoForm = this.builder.group({
      assetname: [{ value: '', disabled: false}, []],
      previouslocation: [{ value: '', disabled: false}, []],
      previouscostcenter: [{ value: '', disabled: false}, []],
      finallocation: [{ value: '', disabled: false}, [Validators.required]],
      transfertype: [{ value: '', disabled: false}, [Validators.required]],
      finalcostcenter: [{ value: '', disabled: false}, []],
      project: [{ value: '', disabled: false}, [Validators.required]],
      companylocalfinal: [{ value: '', disabled: false}, []],
      areafinal: [{ value: '', disabled: false}, []],
      enviromentdetailfinal: [{ value: '', disabled: false}, []],
      floorfinal: [{ value: '', disabled: false}, []],
  
      additionalInformation: [{ value: '', disabled: false}, []],
      approvalUserId: [{ value: null, disabled: false}, []],
      approvedFlag: [{ value: false, disabled: false}, []],
      assetId: [{ value: null, disabled: false}, []],
      code: [{ value: 'T', disabled: false}, []],
      finalLocationId: [{ value: null, disabled: false}, [Validators.required]],
      previousLocationId: [{ value: null, disabled: false}, []],
      projectId: [{ value: null, disabled: false}, [Validators.required]],
      transferResponsibleId: [{ value: 1, disabled: false}, []],
      transferTypeId: [{ value: null, disabled: false}, [Validators.required]],
      datetransfer: [{ value: new Date(), disabled: false}, []],
      hourtransfer: [{ value: new Date(), disabled: false}, []],

      activoSeleccionado:[{ value: '', disabled: false}, []],

    });  
  }

  public async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalActivosPage,
      componentProps: {
        'assets': this.assets,
        'selectedAssets': this.activosSeleccionados,
      }
    });
  
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null) {
        this.activosSeleccionados = dataReturned.data;
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
      this.masivoForm.get('finalLocationId')?.setValue(ubicacion.id);
      this.masivoForm.get('finallocation')?.setValue(ubicacion.name);
      this.masivoForm.get('companylocalfinal')?.setValue(ubicacion.companyLocal.name);
      this.masivoForm.get('areafinal')?.setValue(ubicacion.area.name);
      this.masivoForm.get('enviromentdetailfinal')?.setValue(formattedDetail);
      this.masivoForm.get('floorfinal')?.setValue(ubicacion.enviroment.floor);
    }
  }

  eliminarActivo(index: number) {
    this.activosSeleccionados.splice(index, 1);
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
      this.masivoForm.get('finalLocationId')?.setValue(selectedId);
      this.masivoForm.get('finallocation')?.setValue(selectedLocation.name);
    }
  }

  public onTransferChange(event: CustomEvent) {
    const selectedId = event.detail.value;
    const selectedTransferType = this.transferTypes.find(ttype => ttype.id === selectedId);
  
    if (selectedTransferType) {
      this.masivoForm.get('transferTypeId')?.setValue(selectedId);
      this.masivoForm.get('transfertype')?.setValue(selectedTransferType.name);
    }
  }

  public onProjectChange(event: CustomEvent) {
    const selectedId = event.detail.value;
    const selectedProject = this.projects.find(project => project.id === selectedId);
  
    if (selectedProject) {
      this.masivoForm.get('projectId')?.setValue(selectedId);
      this.masivoForm.get('project')?.setValue(selectedProject.name);
    }
  }

  obtenerFechaHoraActual(): string {
    const ahora = new Date();
    console.log(ahora);
    const año = ahora.getFullYear();
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const día = ahora.getDate().toString().padStart(2, '0');
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const formato = `${año}${mes}${día}${horas}${minutos}`;
    return formato;

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
            const transferencias: AssetTransfer[] =  this.activosSeleccionados.map( activo => {
              return {
                additionalInformation: this.masivoForm.get('additionalInformation')?.value,
                approvalUserId: this.masivoForm.get('approvalUserId')?.value,
                approvedFlag: this.masivoForm.get('approvedFlag')?.value,
                assetId: activo.assetid,
                code: 'T' + this.obtenerFechaHoraActual(),
                finalLocationId: this.masivoForm.get('finalLocationId')?.value,
                previousLocationId: activo.locationid,
                projectId: this.masivoForm.get('projectId')?.value,
                transferResponsibleId: this.masivoForm.get('transferResponsibleId')?.value,
                transferTypeId: this.masivoForm.get('transferTypeId')?.value,
                dateTransfer: this.formatDateToYYYYMMDD(this.masivoForm.get('datetransfer')?.value),
                hourTransfer: this.formatDateToHHMM(this.masivoForm.get('hourtransfer')?.value),
              };
            });
            //console.log(transferencias);
            this.transferService.saveMassive(transferencias).subscribe(response => {
              console.log('Respuesta del servidor:', response);
              this.modalController.dismiss({reload: true});
            });
          }
        }
      ]
    });
    await alert.present();
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


