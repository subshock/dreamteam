import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, switchMap } from 'rxjs';
import { ICompetition } from '../laststand.types';
import { LastStandService } from './laststand.service';

@Injectable({
  providedIn: 'root'
})
export class LastStandStateService {
  refreshSub = new BehaviorSubject<boolean>(true);
  competition$: Observable<ICompetition>;

  constructor(private svc: LastStandService) {
    this.competition$ = this.refreshSub.pipe(
      switchMap(() => this.svc.getLatestCompetition()),
      shareReplay(1)
    );
  }

  refresh(): void {
    this.refreshSub.next(false);
  }
}
