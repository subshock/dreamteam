import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPublicSeasonInfo } from 'src/app/types/public.types';

interface IModel {
  season: IPublicSeasonInfo;
  rounds: any[];
}

@Component({
  templateUrl: './team-leaderboard-report.component.html',
  styleUrls: ['./team-leaderboard-report.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamLeaderboardReportComponent implements OnInit {

  model$: Observable<IModel>;

  constructor(private publicApi: PublicApiService) { }

  ngOnInit(): void {
    this.model$ = this.publicApi.getCurrentSeason().pipe(
      switchMap(s => this.publicApi.getCompletedRounds(s.id).pipe(map(r => ({ season: s, rounds: r }))))
    );
  }

}
