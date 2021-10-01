import { Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPublicSeasonInfo } from 'src/app/types/public.types';

@Injectable({
  providedIn: 'root'
})
export class PublicSeasonStateService {

  private seasonSub = new ReplaySubject<string>();
  season$: Observable<IPublicSeasonInfo>;

  private roundSub = new ReplaySubject<string>();
  round$: Observable<any>;

  constructor(private publicApi: PublicApiService) {
    this.season$ = this.seasonSub.pipe(
      switchMap(sId => publicApi.getSeason(sId)),
      shareReplay(1)
    );

    this.round$ = combineLatest([this.roundSub, this.season$]).pipe(
      switchMap(([rId, s]) => publicApi.getCompletedRound(s.id, rId)),
      shareReplay(1)
    );
  }

  setSeasonId(id: string) {
    this.seasonSub.next(id);
  }

  setRoundId(id: string) {
    this.roundSub.next(id);
  }
}
