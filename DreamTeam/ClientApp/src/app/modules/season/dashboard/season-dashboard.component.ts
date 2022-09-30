import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { PublicApiService } from 'src/app/services/public-api.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { IPlayerLeaderboard, IPublicSeasonInfo, IPublicTradePeriod, ITeamLeaderboard, IUserTeamSummary, SeasonStateType } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

interface ILeaderboard {
  season: IPublicSeasonInfo;
  players: IPlayerLeaderboard[];
  teams: ITeamLeaderboard[];
}

@Component({
  templateUrl: './season-dashboard.component.html',
  styleUrls: ['./season-dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonDashboardComponent implements OnInit {

  teamUpdateSub = new BehaviorSubject<boolean>(true);

  season$: Observable<IPublicSeasonInfo>;
  SeasonStateType = SeasonStateType;
  isAuthenticated$: Observable<boolean>;
  leaderboard$: Observable<ILeaderboard>;
  tradePeriod$: Observable<IPublicTradePeriod>;
  teams$: Observable<IUserTeamSummary[]>;

  readonly leaderboardLimit = 5;

  expand = { 'teams': false };

  constructor(private state: PublicSeasonStateService, private authService: AuthorizeService, private publicApi: PublicApiService,
    private userApi: UserApiService) { }

  ngOnInit(): void {
    this.season$ = this.state.season$.pipe(shareReplay(1));
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
    this.teams$ = this.isAuthenticated$.pipe(
      filter(x => x),
      switchMap(() => this.teamUpdateSub),
      switchMap(() => this.season$),
      tap(s => {
        if (!!s.tradePeriod) { this.expand['teams'] = true; }
      }),
      switchMap(s => this.userApi.getUserTeamsBySeason(s.id))
    );
  }

  teamUpdate(): void {
    this.teamUpdateSub.next(false);
  }
}
