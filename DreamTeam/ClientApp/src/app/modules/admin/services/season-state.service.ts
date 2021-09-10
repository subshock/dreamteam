import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { ISeasonView } from '../admin.types';
import { AdminApiService } from './admin-api.service';

@Injectable({
  providedIn: 'root'
})
export class SeasonStateService {

  private seasonIdSubject = new ReplaySubject<string>();
  private seasonId: string;

  season$: Observable<ISeasonView>;

  private tabsSubject = new BehaviorSubject<{ [key: string]: boolean }>(
    { 'details': true, 'players': true, 'teams': true, 'rounds': true, 'trade-periods': true });
  tabs$: Observable<{ [key: string]: boolean }> = this.tabsSubject.asObservable();

  constructor(private adminSvc: AdminApiService) {
    this.season$ = this.seasonIdSubject.pipe(
      switchMap(id => this.adminSvc.getSeason(id)),
      shareReplay(1)
    );
  }

  setSeasonId(id: string) {
    this.seasonId = id;
    this.seasonIdSubject.next(id);
  }

  refreshSeason() {
    this.seasonIdSubject.next(this.seasonId);
  }

  setTabExclusive(tab: string) {
    const tabs = { ...this.tabsSubject.value };

    for (const key in tabs) {
      if (tabs.hasOwnProperty(key)) {
        tabs[key] = key === tab;
      }
    }

    this.tabsSubject.next(tabs);
  }

  resetTabs() {
    const tabs = { ...this.tabsSubject.value };

    for (const key in tabs) {
      if (tabs.hasOwnProperty(key)) {
        tabs[key] = true;
      }
    }

    this.tabsSubject.next(tabs);
  }
}
