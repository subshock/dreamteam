import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPrizeReport, IPublicSeasonInfo, SeasonStateType } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

interface IModel {
  season: IPublicSeasonInfo;
  prizes: IPrizeReport[];
}

@Component({
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrizesComponent implements OnInit {

  dataSub$: Observable<IModel>;

  SeasonStateType = SeasonStateType;

  constructor(private state: PublicSeasonStateService, private publicApi: PublicApiService) { }

  ngOnInit(): void {
    this.dataSub$ = this.state.season$.pipe(
      switchMap(s => this.publicApi.getPrizeReport(s.id).pipe(map(p => ({ season: s, prizes: p}))))
    );
  }

}
