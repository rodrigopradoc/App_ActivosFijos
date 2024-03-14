import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private baseUrl = 'http://192.168.126.31/asset';

  constructor(private http: HttpClient) { }

  getAssets(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getOneAsset(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
