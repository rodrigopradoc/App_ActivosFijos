import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentrosCostoService {

  private baseUrl = 'http://192.168.126.31/cost-center';

  constructor(private http: HttpClient) { }

  findRealAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }
}
