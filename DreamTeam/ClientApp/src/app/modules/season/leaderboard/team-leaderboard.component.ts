import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { ITeamLeaderboard } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

@Component({
  templateUrl: './team-leaderboard.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamLeaderboardComponent implements OnInit {

  leaderboard$: Observable<ITeamLeaderboard[]>;

  constructor(private state: PublicSeasonStateService, private publicApi: PublicApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.leaderboard$ = combineLatest([this.state.season$, this.route.paramMap]).pipe(
      switchMap(([s, p]) => this.publicApi.getTeamLeaderboardReport(s.id, p.get('id'), null))
    );
  }
}
