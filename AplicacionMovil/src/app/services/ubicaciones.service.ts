import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyLocal } from '../modelos/company-local.modelos';
import { Area } from '../modelos/area.modelos';
import { Enviroment } from '../modelos/enviroment.modelos';
import { ListLocationDto } from '../modelos/location.modelos';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  private baseUrl = 'http://192.168.126.31/location';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAll`);
  }

  listAllLocations(dto?: ListLocationDto): Observable<any> {
  const params = dto ? {...dto} : {};
  return this.http.get(`${this.baseUrl}/`, { params });
  }

  getTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}`, { params: { headMasterCode: 'TIPTRA' } });
  }

  getLocation(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.baseUrl}/area`);
  }

  getCompanyLocals(): Observable<CompanyLocal[]> {
    return this.http.get<CompanyLocal[]>(`${this.baseUrl}/company-local`);
  }

  getEnvironments(): Observable<Enviroment[]> {
    return this.http.get<Enviroment[]>(`${this.baseUrl}/environment`);
  }
}
