import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private baseUrl = 'http://192.168.126.31/project';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}


