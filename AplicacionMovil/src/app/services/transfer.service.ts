import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private baseUrl = 'http://192.168.126.31/transfer';
  constructor(private http: HttpClient) { }

  getAllAssetTransfer(dto: any): Observable<any[]> {
    const defaultParams = {
      initDate: this.getTwoYearsAgoDate(),
      finalDate: this.getFutureDate(2) 
    };
    const params = { ...defaultParams, ...dto };

    const formattedParams = {
      initDate: params.initDate.toISOString().split('T')[0],
      finalDate: params.finalDate.toISOString().split('T')[0],
    };

    return this.http.get<any[]>(`${this.baseUrl}`, { params: formattedParams });
  }

  private getTwoYearsAgoDate(): Date {
    const today = new Date();
    const fiveYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
    return fiveYearsAgo;
  }

  private getFutureDate(days: number): Date {
    const today = new Date();
    const futureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
    return futureDate;
  }

  saveTransfer(dto: any): Observable<any>{
    console.log('Datos enviados a saveTransfer:', dto);
    return this.http.post(`${this.baseUrl}`,dto)
  }

  saveMassive(dto: any): Observable<any>{
    console.log('Datos enviados a saveTransfer:', dto);
    return this.http.post(`${this.baseUrl}/massive`,dto)
  }
}