import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IAddUpdateTenant,
  IAppUser,
  IPaymentDetail,
  IPaymentSearch,
  IPaymentSummary,
  ITenant, ITenantAdmin
} from '../admin.types';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private apiBase: string;

  constructor(private httpClient: HttpClient, @Inject(APP_BASE_HREF) baseHref: string) {
    this.apiBase = baseHref + 'api/admin';
  }

  searchPayments(search: IPaymentSearch): Observable<IPaymentSummary[]> {
    const opts = {
      params: {
        from: encodeURIComponent(search.from),
        to: encodeURIComponent(search.to),
        token: search.token,
        status: String(search.status)
      }
    };
    return this.httpClient.get<IPaymentSummary[]>(`${this.apiBase}/payment`, opts);
  }

  getPaymentDetails(id: string): Observable<IPaymentDetail> {
    return this.httpClient.get<IPaymentDetail>(`${this.apiBase}/payment/${encodeURIComponent(id)}`);
  }

  listTenants(): Observable<ITenant[]> {
    return this.httpClient.get<ITenant[]>(`${this.apiBase}/tenant`);
  }

  getTenant(id: string): Observable<ITenant> {
    return this.httpClient.get<ITenant>(`${this.apiBase}/tenant/${encodeURIComponent(id)}`);
  }

  addTenant(item: IAddUpdateTenant): Observable<unknown> {
    return this.httpClient.post(`${this.apiBase}/tenant`, item);
  }

  updateTenant(slug: string, item: IAddUpdateTenant): Observable<unknown> {
    return this.httpClient.post(`${this.apiBase}/tenant/${encodeURIComponent(slug)}`, item);
  }

  listTenantAdmins(slug: string): Observable<ITenantAdmin[]> {
    return this.httpClient.get<ITenantAdmin[]>(`${this.apiBase}/tenant/${encodeURIComponent(slug)}/admins`);
  }

  addTenantAdmin(slug: string, userId: string): Observable<unknown> {
    return this.httpClient.post(`${this.apiBase}/tenant/${encodeURIComponent(slug)}/admins/${encodeURIComponent(userId)}`, null);
  }

  removeTenantAdmin(slug: string, userId: string): Observable<unknown> {
    return this.httpClient.delete(`${this.apiBase}/tenant/${encodeURIComponent(slug)}/admins/${encodeURIComponent(userId)}`);
  }

  listUsers(): Observable<IAppUser[]> {
    return this.httpClient.get<IAppUser[]>(`${this.apiBase}/user`);
  }

  getCors(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBase}/system/cors`);
  }
}
