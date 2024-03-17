import { Injectable } from '@angular/core';
import { AdminApiService } from './admin-api.service';
import { ICompetition } from '../laststand.admin.types';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LastStandStateService {

  private competitionIdSub = new ReplaySubject<string>(1);
  competition$: Observable<ICompetition>;

  constructor(private adminSvc: AdminApiService) {
    this.competition$ = this.competitionIdSub.pipe(
      switchMap(id => this.adminSvc.getLastStandCompetition(id)),
      shareReplay(1)
    );
  }

  setCompetitionId(id: string): void {
    this.competitionIdSub.next(id);
  }
}
