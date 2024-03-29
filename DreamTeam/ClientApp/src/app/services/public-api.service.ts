import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPaymentSettings, IPlayerLeaderboard, IPlayerReport, IPrizeReport, IPublicSeasonInfo,
  IPublicTenant, ISeasonContent, ITeamLeaderboard, ITeamReport, ITenantSeason
} from '../types/public.types';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  private apiBase: string;

  constructor(private httpClient: HttpClient, @Inject(APP_BASE_HREF) baseHref: string) {
    this.apiBase = baseHref + 'api/public';
  }

  getTenants(): Observable<ITenantSeason[]> {
    return this.httpClient.get<ITenantSeason[]>(`${this.apiBase}/tenant`);
  }

  getTenant(slug: string): Observable<IPublicTenant> {
    return this.httpClient.get<IPublicTenant>(`${this.apiBase}/tenant/${encodeURIComponent(slug)}`);
  }

  getTenantSeasons(slug: string): Observable<ITenantSeason> {
    return this.httpClient.get<ITenantSeason>(`${this.apiBase}/tenant/${encodeURIComponent(slug)}/seasons`);
  }

  getSeason(id: string): Observable<IPublicSeasonInfo> {
    return this.httpClient.get<IPublicSeasonInfo>(`${this.apiBase}/season/${encodeURIComponent(id)}`);
  }

  getSeasonContent(id: string, name: string): Observable<ISeasonContent> {
    return this.httpClient.get<ISeasonContent>(`${this.apiBase}/season/${encodeURIComponent(id)}/content/${encodeURIComponent(name)}`);
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

  getTeamLeaderboardReport(seasonId: string, roundId: string | null, limit: number | null): Observable<ITeamLeaderboard[]> {
    const suffix = roundId == null ? '' : `/${encodeURIComponent(roundId)}`;
    const opts = limit != null ? { params: { limit: limit } } : {};
    return this.httpClient.get<ITeamLeaderboard[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}` +
      `/reports/teams/leaderboard${suffix}`,
      opts);
  }

  getPlayerLeaderboardReport(seasonId: string, roundId: string | null, limit: number | null): Observable<IPlayerLeaderboard[]> {
    const suffix = roundId == null ? '' : `/${encodeURIComponent(roundId)}`;
    const opts = limit != null ? { params: { limit: limit } } : {};
    return this.httpClient.get<IPlayerLeaderboard[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}` +
      `/reports/players/leaderboard${suffix}`,
      opts);
  }

  getPlayerReport(seasonId: string, playerId: string): Observable<IPlayerReport> {
    return this.httpClient.get<IPlayerReport>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/reports/player/` +
      encodeURIComponent(playerId));
  }

  getTeamReport(seasonId: string, teamId: string): Observable<ITeamReport> {
    return this.httpClient.get<ITeamReport>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/reports/team/` +
      encodeURIComponent(teamId));
  }

  getPrizeReport(seasonId: string): Observable<IPrizeReport[]> {
    return this.httpClient.get<IPrizeReport[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/reports/prizes`);
  }

  getPaymentSettings(): Observable<IPaymentSettings> {
    return this.httpClient.get<IPaymentSettings>(`${this.apiBase}/settings/payment`);
  }

}
