import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPublicSeasonInfo } from '../types/public.types';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  private apiBase: string;

  constructor(private httpClient: HttpClient, @Inject(APP_BASE_HREF) baseHref: string) {
    this.apiBase = baseHref + 'api/public';
  }

  getCurrentSeason(): Observable<IPublicSeasonInfo> {
    return this.httpClient.get<IPublicSeasonInfo>(`${this.apiBase}/season/current`);
  }
}
