import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { ITradePeriod } from '../modules/admin/admin.types';
import { IPublicSeasonInfo, ITeamAndTradePeriod, ITeamPlayerUpdate, ITeamPlayerUpdateResult, ITeamRegister, ITeamRegisterResult } from '../types/public.types';
import { PublicApiService } from './public-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private apiBase: string;

  constructor(private httpClient: HttpClient, @Inject(APP_BASE_HREF) baseHref: string, public publicApi: PublicApiService) {
    this.apiBase = baseHref + 'api/user';
  }

  registerTeams(seasonId: string, teams: ITeamRegister[]): Observable<ITeamRegisterResult> {
    const params = { seasonId: seasonId, teams: teams };
    return this.httpClient.post<ITeamRegisterResult>(`${this.apiBase}/teams/register`, params);
  }

  getUserTeams(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiBase}/teams`);
  }

  getUserTeam(teamId: string): Observable<ITeamAndTradePeriod> {
    return this.httpClient.get<ITeamAndTradePeriod>(`${this.apiBase}/teams/${encodeURIComponent(teamId)}`);
  }

  updateTeam(teamId: string, details: ITeamRegister): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/teams/${encodeURIComponent(teamId)}/details`, details);
  }

  getCurrentTradePeriod(seasonId: string): Observable<ITradePeriod> {
    return this.httpClient.get<ITradePeriod>(`${this.apiBase}/seasons/trade-period/current`);
  }

  updateTeamPlayers(teamId: string, model: ITeamPlayerUpdate): Observable<ITeamPlayerUpdateResult> {
    return this.httpClient.post<ITeamPlayerUpdateResult>(`${this.apiBase}/teams/${encodeURIComponent(teamId)}/players`, model);
  }
}
