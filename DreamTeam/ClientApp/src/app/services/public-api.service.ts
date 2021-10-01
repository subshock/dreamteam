import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaymentSettings, IPublicSeasonInfo } from '../types/public.types';

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

  getSeason(id: string): Observable<IPublicSeasonInfo> {
    return this.httpClient.get<IPublicSeasonInfo>(`${this.apiBase}/season/${encodeURIComponent(id)}`);
  }

  getSeasonPlayers(seasonId: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/players`);
  }

  getCompletedRounds(seasonId: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds`);
  }

  getCompletedRound(seasonId: string, roundId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/round/${encodeURIComponent(roundId)}`);
  }

  getTeamLeaderboardReport(seasonId: string, roundId: string | null, limit: number | null) {
    const suffix = roundId == null ? '' : `/${encodeURIComponent(roundId)}`;
    const opts = limit != null ? { params: { limit: limit }} : {};
    return this.httpClient.get<any[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/reports/teams/leaderboard${suffix}`,
      opts);
  }

  getPlayerLeaderboardReport(seasonId: string, roundId: string | null, limit: number | null) {
    const suffix = roundId == null ? '' : `/${encodeURIComponent(roundId)}`;
    const opts = limit != null ? { params: { limit: limit }} : {};
    return this.httpClient.get<any[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/reports/players/leaderboard${suffix}`,
      opts);
  }

  getPaymentSettings(): Observable<IPaymentSettings> {
    return this.httpClient.get<IPaymentSettings>(`${this.apiBase}/settings/payment`);
  }
}
