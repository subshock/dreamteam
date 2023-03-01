import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICompetition, IPaymentSettings, IRegister, IRegisterResult } from '../laststand.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastStandService {

  private apiBase: string;

  constructor(private http: HttpClient) {
    this.apiBase = environment.apiUrl + '/api/public';
  }

  getLatestCompetition(): Observable<ICompetition> {
    return this.http.get<ICompetition>(`${this.apiBase}/laststand/competition`);
  }

  registerEntry(item: IRegister): Observable<IRegisterResult> {
    return this.http.post<IRegisterResult>(`${this.apiBase}/laststand/register`, item);
  }

  getPaymentSettings(): Observable<IPaymentSettings> {
    return this.http.get<IPaymentSettings>(`${this.apiBase}/settings/payment`);
  }
}
