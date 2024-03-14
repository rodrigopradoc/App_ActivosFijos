import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private baseUrl = 'http://localhost:3000/project';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}


