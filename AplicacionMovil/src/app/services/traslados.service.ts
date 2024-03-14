import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrasladosService {

  private baseUrl = 'http://192.168.126.31/master-master';

  constructor(private http: HttpClient) { }

  getTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}`, { params: { headMasterCode: 'TIPTRA' } });
  }
}




