import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPlayerLeaderboard, IPublicSeasonInfo } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

interface IModel {
  season: IPublicSeasonInfo;
  leaderboard: IPlayerLeaderboard[];
}

@Component({
  templateUrl: './player-leaderboard.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerLeaderboardComponent implements OnInit {

  model$: Observable<IModel>;

  constructor(private state: PublicSeasonStateService, private publicApi: PublicApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.model$ = combineLatest([this.state.season$, this.route.paramMap]).pipe(
      switchMap(([s, p]) => this.publicApi.getPlayerLeaderboardReport(s.id, p.get('id'), null)
        .pipe(map(l => ({ season: s, leaderboard: l }))))
    );
  }
}
