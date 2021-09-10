import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IPlayerUpdate, IPlayerView, IRoundPlayer, IRoundPlayerUpdate, IRoundSummary, IRoundUpdate, IRoundView,
  ISeasonSummary, ISeasonUpdate, ISeasonView, ITeamSummary, ITradePeriod, ITradePeriodUpdate, SeasonStateType
} from '../admin.types';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private apiBase: string;

  constructor(private httpClient: HttpClient, @Inject(APP_BASE_HREF) baseHref: string) {
    this.apiBase = baseHref + 'api/admin';
  }

  getSeasons(): Observable<ISeasonSummary[]> {
    return this.httpClient.get<ISeasonSummary[]>(`${this.apiBase}/season`);
  }

  getSeason(id: string): Observable<ISeasonView> {
    return this.httpClient.get<ISeasonView>(`${this.apiBase}/season/${encodeURIComponent(id)}`);
  }

  addSeason(season: ISeasonUpdate): Observable<{ id: string }> {
    return this.httpClient.post<{ id: string }>(`${this.apiBase}/season`, season);
  }

  updateSeason(id: string, season: ISeasonUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/season/${encodeURIComponent(id)}`, season);
  }

  changeSeasonStatus(id: string, newState: SeasonStateType): Observable<{ result: boolean }> {
    return this.httpClient.post<{ result: boolean }>(`${this.apiBase}/season/${encodeURIComponent(id)}/status`, newState);
  }

  getPlayers(seasonId: string): Observable<IPlayerView[]> {
    return this.httpClient.get<IPlayerView[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/players`);
  }

  addPlayer(seasonId: string, player: IPlayerUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/players`, player);
  }

  updatePlayer(seasonId: string, playerId: string, player: IPlayerUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/players/${encodeURIComponent(playerId)}`, player);
  }

  deletePlayer(seasonId: string, playerId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/players/${encodeURIComponent(playerId)}`);
  }

  getTeams(seasonId: string): Observable<ITeamSummary[]> {
    return this.httpClient.get<ITeamSummary[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/teams`);
  }

  getRounds(seasonId: string): Observable<IRoundSummary[]> {
    return this.httpClient.get<IRoundSummary[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds`);
  }

  getRound(seasonId: string, roundId: string): Observable<IRoundView> {
    return this.httpClient.get<IRoundView>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}`);
  }

  addRound(seasonId: string, round: IRoundUpdate): Observable<{ id: string }> {
    return this.httpClient.post<{ id: string }>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds`, round);
  }

  updateRound(seasonId: string, roundId: string, round: IRoundUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}`, round);
  }

  deleteRound(seasonId: string, roundId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}`);
  }

  getRoundPlayers(seasonId: string, roundId: string): Observable<IRoundPlayer[]> {
    return this.httpClient.get<IRoundPlayer[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds/` +
      `${encodeURIComponent(roundId)}/players`);
  }

  addRoundPlayer(seasonId: string, roundId: string, player: IRoundPlayerUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}/players`,
      player);
  }

  updateRoundPlayer(seasonId: string, roundId: string, playerId: string, player: IRoundPlayerUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}/players/` +
      `${encodeURIComponent(playerId)}`, player);
  }

  deleteRoundPlayer(seasonId: string, roundId: string, playerId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}/players` +
      `/${encodeURIComponent(playerId)}`);
  }

  getTradePeriods(seasonId: string): Observable<ITradePeriod[]> {
    return this.httpClient.get<ITradePeriod[]>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/tradeperiods`);
  }

  addTradePeriod(seasonId, tradePeriod: ITradePeriodUpdate): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/tradeperiods`, tradePeriod);
  }

  updateTradePeriod(seasonId: string, tradePeriodId: string, tradePeriod: ITradePeriodUpdate): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/tradeperiods` +
      `/${encodeURIComponent(tradePeriodId)}`, tradePeriod);
  }

  deleteTradePeriod(seasonId: string, tradePeriodId: string) {
    return this.httpClient.delete<any>(`${this.apiBase}/season/${encodeURIComponent(seasonId)}/tradeperiods` +
      `/${encodeURIComponent(tradePeriodId)}`);
  }
}
