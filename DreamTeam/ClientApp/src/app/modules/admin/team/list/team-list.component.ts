import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ITeamSummary } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';
import { SeasonStateService } from '../../services/season-state.service';

@Component({
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.less']
})
export class TeamListComponent implements OnInit {

  refreshSub = new BehaviorSubject<boolean>(true);
  teams$: Observable<ITeamSummary[]>;

  constructor(private state: SeasonStateService, private adminApi: AdminApiService) { }

  ngOnInit(): void {
    this.teams$ = combineLatest([this.state.season$, this.refreshSub]).pipe(
      switchMap(([s]) => this.adminApi.getTeams(s.id))
    );
  }

  refresh() {
    this.refreshSub.next(false);
  }
}
