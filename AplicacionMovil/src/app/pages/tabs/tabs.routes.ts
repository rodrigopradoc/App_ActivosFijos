import { Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then( m => m.HomePage)
      },
      {
        path: 'activos-transferencia',
        loadComponent: () => import('./activos-transferencia/activos-transferencia.page').then( m => m.ActivosTransferenciaPage)
      },
      {
        path: 'modal-activos-transferencia',
        loadComponent: () => import('./activos-transferencia/modal-activos-transferencia/modal-activos-transferencia.page').then( m => m.ModalActivosTransferenciaPage)
      },
      {
        path: 'activos-alta',
        loadComponent: () => import('./activos-alta/activos-alta.page').then( m => m.ActivosAltaPage)
      },
      {
        path: 'modal-masivo-transferencia',
        loadComponent: () => import('./activos-transferencia/modal-masivo-transferencia/modal-masivo-transferencia.page').then( m => m.ModalMasivoTransferenciaPage)
      },
      {
        path: 'modal-activos',
        loadComponent: () => import('./activos-transferencia/modal-masivo-transferencia/modal-activos/modal-activos.page').then( m => m.ModalActivosPage)
      },
      {
        path: 'menu',
        loadComponent: () => import('./menu/menu.page').then( m => m.MenuPage)
      },
      {
        path: 'modal-detalle-transferencia',
        loadComponent: () => import('./activos-transferencia/modal-detalle-transferencia/modal-detalle-transferencia.page').then( m => m.ModalDetalleTransferenciaPage)
      },
      {
        path: 'modal-agregar',
        loadComponent: () => import('./activos-transferencia/modal-activos-transferencia/modal-agregar/modal-agregar.page').then( m => m.ModalAgregarPage)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },  {
    path: 'modal-ubicacion',
    loadComponent: () => import('./utils/modal-ubicacion/modal-ubicacion.page').then( m => m.ModalUbicacionPage)
  },
  {
    path: 'detalle-ubicacion',
    loadComponent: () => import('./utils/detalle-ubicacion/detalle-ubicacion.page').then( m => m.DetalleUbicacionPage)
  },

];