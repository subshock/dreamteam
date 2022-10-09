import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISeasonContent, SeasonStateType } from 'src/app/types/public.types';
import {
  IPlayerUpdate, IPlayerView, IPrize, IPrizeUpdate, IRoundPlayer, IRoundPlayerUpdate, IRoundSummary, IRoundUpdate, IRoundView,
  ISeasonSummary, ISeasonUpdate, ISeasonView, ITeamSummary, ITradePeriod, ITradePeriodUpdate
} from './tenant-admin.types';

@Injectable({
  providedIn: 'root'
})
export class TenantAdminService {

  private apiBase: string;

  constructor(private httpClient: HttpClient, @Inject(APP_BASE_HREF) baseHref: string) {
    this.apiBase = baseHref + 'api/tenant';
  }

  getSeasons(slug: string): Observable<ISeasonSummary[]> {
    return this.httpClient.get<ISeasonSummary[]>(`${this.apiBase}/${encodeURIComponent(slug)}/season`);
  }

  getSeason(slug: string, id: string): Observable<ISeasonView> {
    return this.httpClient.get<ISeasonView>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(id)}`);
  }

  addSeason(slug: string, season: ISeasonUpdate): Observable<{ id: string }> {
    return this.httpClient.post<{ id: string }>(`${this.apiBase}/${encodeURIComponent(slug)}/season`, season);
  }

  updateSeason(slug: string, id: string, season: ISeasonUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(id)}`, season);
  }

  changeSeasonStatus(slug: string, id: string, newState: SeasonStateType): Observable<{ result: boolean }> {
    return this.httpClient.post<{ result: boolean }>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(id)}/status`,
      newState);
  }

  getPlayers(slug: string, seasonId: string): Observable<IPlayerView[]> {
    return this.httpClient.get<IPlayerView[]>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/players`);
  }

  addPlayer(slug: string, seasonId: string, player: IPlayerUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/players`, player);
  }

  updatePlayer(slug: string, seasonId: string, playerId: string, player: IPlayerUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/players/${encodeURIComponent(playerId)}`, player);
  }

  deletePlayer(slug: string, seasonId: string, playerId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/players/${encodeURIComponent(playerId)}`);
  }

  importPlayers(slug: string, seasonId: string, file: any, hasHeader: boolean, overwrite: boolean): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<string[]>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/players/import` +
      `?hasHeaders=${!!hasHeader}&overwrite=${!!overwrite}`, formData);
  }

  getTeams(slug: string, seasonId: string): Observable<ITeamSummary[]> {
    return this.httpClient.get<ITeamSummary[]>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/teams`);
  }

  markTeamAsPaid(slug: string, seasonId: string, teamId: string): Observable<unknown> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/teams/${encodeURIComponent(teamId)}/payment`, null);
  }

  markTeamAsUnpaid(slug: string, seasonId: string, teamId: string): Observable<unknown> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/teams/${encodeURIComponent(teamId)}/payment/reset`, null);
  }

  getRounds(slug: string, seasonId: string): Observable<IRoundSummary[]> {
    return this.httpClient.get<IRoundSummary[]>(`${this.apiBase}/${encodeURIComponent(slug)}/season/` +
      `${encodeURIComponent(seasonId)}/rounds`);
  }

  getRound(slug: string, seasonId: string, roundId: string): Observable<IRoundView> {
    return this.httpClient.get<IRoundView>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}`);
  }

  addRound(slug: string, seasonId: string, round: IRoundUpdate): Observable<{ id: string }> {
    return this.httpClient.post<{ id: string }>(`${this.apiBase}/${encodeURIComponent(slug)}/season/` +
      `${encodeURIComponent(seasonId)}/rounds`, round);
  }

  updateRound(slug: string, seasonId: string, roundId: string, round: IRoundUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}`, round);
  }

  deleteRound(slug: string, seasonId: string, roundId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}`);
  }

  getRoundPlayers(slug: string, seasonId: string, roundId: string): Observable<IRoundPlayer[]> {
    return this.httpClient.get<IRoundPlayer[]>(`${this.apiBase}/${encodeURIComponent(slug)}/season/` +
      `${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}/players`);
  }

  addRoundPlayer(slug: string, seasonId: string, roundId: string, player: IRoundPlayerUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}/players`,
      player);
  }

  updateRoundPlayer(slug: string, seasonId: string, roundId: string, playerId: string, player: IRoundPlayerUpdate): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}/players/` +
      `${encodeURIComponent(playerId)}`, player);
  }

  deleteRoundPlayer(slug: string, seasonId: string, roundId: string, playerId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}/players` +
      `/${encodeURIComponent(playerId)}`);
  }

  completeRound(slug: string, seasonId: string, roundId: string): Observable<any> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/rounds/${encodeURIComponent(roundId)}/complete`,
      null);
  }

  getTradePeriods(slug: string, seasonId: string): Observable<ITradePeriod[]> {
    return this.httpClient.get<ITradePeriod[]>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/tradeperiods`);
  }

  addTradePeriod(slug: string, seasonId: string, tradePeriod: ITradePeriodUpdate): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}` +
      `/tradeperiods`, tradePeriod);
  }

  updateTradePeriod(slug: string, seasonId: string, tradePeriodId: string, tradePeriod: ITradePeriodUpdate): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/tradeperiods` +
      `/${encodeURIComponent(tradePeriodId)}`, tradePeriod);
  }

  deleteTradePeriod(slug: string, seasonId: string, tradePeriodId: string) {
    return this.httpClient.delete<any>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/tradeperiods` +
      `/${encodeURIComponent(tradePeriodId)}`);
  }

  getPrizes(slug: string, seasonId: string): Observable<IPrize[]> {
    return this.httpClient.get<IPrize[]>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/prizes`);
  }

  getPrize(slug: string, seasonId: string, id: string): Observable<IPrize> {
    return this.httpClient.get<IPrize>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/prizes/` +
      `${encodeURIComponent(id)}`);
  }

  addPrize(slug: string, seasonId: string, model: IPrizeUpdate): Observable<unknown> {
    return this.httpClient.post<unknown>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/prizes`,
      model);
  }

  updatePrize(slug: string, seasonId: string, id: string, model: IPrizeUpdate): Observable<unknown> {
    return this.httpClient.post<unknown>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/prizes/` +
      `${encodeURIComponent(id)}`, model);
  }

  deletePrize(slug: string, seasonId: string, id: string): Observable<unknown> {
    return this.httpClient.delete<unknown>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/prizes/` +
      `${encodeURIComponent(id)}`);
  }

  setPrizeOrder(slug: string, seasonId: string, prizeIds: string[]): Observable<unknown> {
    return this.httpClient.post<unknown>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}/prizes/order`,
      prizeIds);
  }

  getSeasonContent(slug: string, seasonId: string, name: string): Observable<ISeasonContent> {
    return this.httpClient.get<ISeasonContent>(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}` +
      `/content/${encodeURIComponent(name)}`);
  }

  updateSeasonContent(slug: string, seasonId: string, item: ISeasonContent): Observable<unknown> {
    return this.httpClient.post(`${this.apiBase}/${encodeURIComponent(slug)}/season/${encodeURIComponent(seasonId)}` +
      `/content/${encodeURIComponent(item.name)}`, item);
  }
}
