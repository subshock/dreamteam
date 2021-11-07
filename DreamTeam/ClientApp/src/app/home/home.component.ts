import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, EMPTY, from, Observable } from 'rxjs';
import { delay, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { SeasonStateType } from '../modules/admin/admin.types';
import { DynamicScriptLoaderService } from '../services/dynamic-script-loader.service';
import { PublicApiService } from '../services/public-api.service';
import { UserApiService } from '../services/user-api.service';
import { IPlayerLeaderboard, IPublicSeasonInfo, IPublicTradePeriod, ITeamLeaderboard } from '../types/public.types';

interface ILeaderboard {
  season: IPublicSeasonInfo;
  players: IPlayerLeaderboard[];
  teams: ITeamLeaderboard[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  season$: Observable<IPublicSeasonInfo>;
  SeasonStateType = SeasonStateType;
  isAuthenticated$: Observable<boolean>;
  leaderboard$: Observable<ILeaderboard>;
  tradePeriod$: Observable<IPublicTradePeriod>;

  readonly leaderboardLimit = 5;

  constructor(private publicApi: PublicApiService, private authService: AuthorizeService) { }

  ngOnInit(): void {
    this.season$ = this.publicApi.getCurrentSeason().pipe(shareReplay(1));
    this.tradePeriod$ = this.season$.pipe(
      filter(x => !!x.tradePeriod),
      map(x => x.tradePeriod)
    );
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.leaderboard$ = this.season$.pipe(
      filter(s => s.status >= SeasonStateType.Running),
      switchMap(s => combineLatest([
        this.publicApi.getPlayerLeaderboardReport(s.id, null, this.leaderboardLimit),
        this.publicApi.getTeamLeaderboardReport(s.id, null, this.leaderboardLimit)
      ]).pipe(map(([p, t]) => ({ season: s, players: p, teams: t }))))
    );
  }
}
