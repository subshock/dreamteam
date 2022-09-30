import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TenantStateService } from '../../../tenant/tenant-state.service';
import { TenantAdminService } from '../../tenant-admin.service';
import { ITeamSummary } from '../../tenant-admin.types';

@Component({
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.less']
})
export class TeamListComponent implements OnInit {

  refreshSub = new BehaviorSubject<boolean>(true);
  teams$: Observable<ITeamSummary[]>;

  constructor(private state: TenantStateService, private adminApi: TenantAdminService) { }

  ngOnInit(): void {
    this.teams$ = combineLatest([this.state.tenant$, this.state.season$, this.refreshSub]).pipe(
      switchMap(([t, s]) => this.adminApi.getTeams(t.slug, s.id))
    );
  }

  refresh() {
    this.refreshSub.next(false);
  }
}
