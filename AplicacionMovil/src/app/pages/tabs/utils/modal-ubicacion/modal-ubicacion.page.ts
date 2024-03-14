import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { Observable, map, of, tap } from 'rxjs';
import { CompanyLocal } from 'src/app/modelos/company-local.modelos';
import { Area } from 'src/app/modelos/area.modelos';
import { Enviroment } from 'src/app/modelos/enviroment.modelos';
import { Location, Ubicacion } from 'src/app/modelos/location.modelos';

@Component({
  selector: 'app-modal-ubicacion',
  templateUrl: './modal-ubicacion.page.html',
  styleUrls: ['./modal-ubicacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ModalUbicacionPage implements OnInit {
  public companyLocals$!: Observable<CompanyLocal[]>;
  public areas$!: Observable<Area[]>;
  public environments$!: Observable<Enviroment[]>;
  public filteredEnvironments$!: Observable<Enviroment[]>;
  private ubicaciones!: Location[];
  private selectedLocal!: CompanyLocal;
  private selectedArea!: Area;
  private selectedEnvironment!: Enviroment;
  public ubicacionSeleccionada: any;
  public floors: number[] = [];
  public ubicacionForm : UntypedFormGroup = new UntypedFormGroup({});
  filteredEnvironments: Enviroment[] = [];

  constructor(
    private builder: UntypedFormBuilder,
    private ubicacionesService: UbicacionesService,
    private modalController: ModalController,
    private navParams: NavParams,
  ) { 
    this.ubicacionSeleccionada = this.navParams.get('selectedLocation');
    console.log(this.ubicacionSeleccionada)
  }

  ngOnInit() {
    this.crearFormulario();
    this.obtenerUbicaciones();
    this.companyLocals$ = this.ubicacionesService.getCompanyLocals();
    this.areas$ = this.ubicacionesService.getAreas();
    this.environments$ = this.ubicacionesService.getEnvironments();
    if(this.ubicacionSeleccionada) {
      this.asignarInformacion(this.ubicacionSeleccionada);
    }
  }

  private crearFormulario() {
    this.ubicacionForm = this.builder.group({
      local: [{ value: null, disabled: false}, []],
      area: [{ value: null, disabled: true}, []],
      piso: [{ value: null, disabled: true}, []],
      ambiente: [{ value: null, disabled: true}, []],
    })
  }

  private asignarInformacion(informacion: Location) {
    this.ubicacionForm.get('local')?.setValue(informacion.companyLocal);
    this.ubicacionForm.get('area')?.setValue(informacion.area);
    this.ubicacionForm.get('piso')?.setValue(informacion.enviroment.floor);
    this.ubicacionForm.get('ambiente')?.setValue(informacion.enviroment);
  }

  private obtenerUbicaciones() {
    this.ubicacionesService.listAllLocations().subscribe(ubicaciones => {
      this.ubicaciones = ubicaciones;
    });
  }

  cancelChanges() {
    this.modalController.dismiss(this.ubicacionSeleccionada);
  }

  confirmChanges() {
    this.modalController.dismiss(this.ubicacionSeleccionada);
  }

  onLocalChange(event: CustomEvent) {
    this.selectedLocal = event.detail.value;
    this.ubicacionForm.get('area')?.enable();
    this.ubicacionForm.get('piso')?.enable();
    this.ubicacionForm.get('ambiente')?.enable();
    this.areas$ = of(this.ubicaciones
      .filter(ubicacion => ubicacion.companyLocal.id === this.selectedLocal.id)
      .map(ubicacion => ubicacion.area));
    this.environments$ = of(this.ubicaciones
      .filter(ubicacion => ubicacion.companyLocal.id === this.selectedLocal.id)
      .map(ubicacion => ubicacion.enviroment));

    // Obtener todos los pisos posibles de los ambientes del local seleccionado
    this.floors = this.getFloorsForLocal(this.selectedLocal);
  }

  onAreaChange(event: CustomEvent) {
    this.selectedArea = event.detail.value;
    // Si se ha seleccionado un área, mostrar solo los ambientes de esa área
    if (this.selectedArea) {
      this.environments$ = of(this.ubicaciones
        .filter(ubicacion => ubicacion.area && ubicacion.area.id === this.selectedArea.id)
        .map(ubicacion => ubicacion.enviroment));
      // Obtener todos los pisos posibles de los ambientes del área seleccionada
      this.floors = this.getFloorsForArea(this.selectedArea);
    } else {
      // Si no se ha seleccionado un área, mostrar todos los ambientes del local
      console.log('gaa');
      this.environments$ = of(this.ubicaciones
        .filter(ubicacion => ubicacion.companyLocal.id === this.selectedLocal.id)
        .map(ubicacion => ubicacion.enviroment));
      // Obtener todos los pisos posibles de los ambientes del local seleccionado
      this.floors = this.getFloorsForLocal(this.selectedLocal);
    }
  }

  onFloorChange(event: CustomEvent) {
    const selectedFloor = event.detail.value;
  
    // Filtrar los ambientes por piso seleccionado
    this.environments$ = this.environments$.pipe(
      map(environments => {
        const filteredEnvironments = environments.filter(env => env.floor === selectedFloor);
        console.log('Ambientes filtrados por piso:', filteredEnvironments);
        return filteredEnvironments;
      })
    );
  }
  
  onEnvironmentChange(event: CustomEvent) {
    this.selectedEnvironment = event.detail.value;
    
    if (this.selectedLocal && this.selectedArea) {
      const ubicacion = this.ubicaciones.find(ubicacion => 
        ubicacion.companyLocal.id === this.selectedLocal.id && 
        ubicacion.area.id === this.selectedArea.id && 
        ubicacion.enviroment.id === this.selectedEnvironment.id);
        
      if (ubicacion) {
        this.ubicacionSeleccionada = ubicacion;
      }
    } else if (this.selectedLocal) {
      // Si no se ha seleccionado un área, buscar la ubicación que coincida con el local y el ambiente
      const ubicacion = this.ubicaciones.find(ubicacion => 
        ubicacion.companyLocal.id === this.selectedLocal.id && 
        ubicacion.enviroment.id === this.selectedEnvironment.id);
        
      if (ubicacion) {
        this.ubicacionSeleccionada = ubicacion;
      }
    }
    console.log(this.ubicacionSeleccionada);
  }

  private getFloorsForLocal(local: CompanyLocal): number[] {
    const floors: number[] = [];
    this.ubicaciones
      .filter(ubicacion => ubicacion.companyLocal.id === local.id)
      .forEach(ubicacion => {
        if (!floors.includes(ubicacion.enviroment.floor)) {
          floors.push(ubicacion.enviroment.floor);
        }
      });
    return floors;
  }

  private getFloorsForArea(area: Area): number[] {
    const floors: number[] = [];
    this.ubicaciones
      .filter(ubicacion => ubicacion.area && ubicacion.area.id === area.id)
      .forEach(ubicacion => {
        if (!floors.includes(ubicacion.enviroment.floor)) {
          floors.push(ubicacion.enviroment.floor);
        }
      });
    return floors;
  }
}
