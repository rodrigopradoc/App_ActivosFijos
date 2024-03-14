import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { Location } from 'src/app/modelos/location.modelos';

@Component({
  selector: 'app-detalle-ubicacion',
  templateUrl: './detalle-ubicacion.page.html',
  styleUrls: ['./detalle-ubicacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetalleUbicacionPage implements OnInit {
  public finalLocationID!: number;
  public ubicacion!: Location;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private ubicacionesService: UbicacionesService,
  ) { }

  ngOnInit() {
    this.finalLocationID = this.navParams.get('finallocationid')
    this.obtenerDetalles();
  }

  private obtenerDetalles() {
    this.ubicacionesService.getLocation(this.finalLocationID).subscribe({
      next: (data) => {
        this.ubicacion=data;
        console.log(this.ubicacion)
      }
    })
  }

  cerrar() {
    this.modalController.dismiss();;
  }
}
