import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { shareReplay, switchMap, take } from 'rxjs/operators';
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

  private subscriptions: Subscription;

  constructor(private state: TenantStateService, private adminApi: TenantAdminService) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();

    this.teams$ = combineLatest([this.state.tenant$, this.state.season$, this.refreshSub]).pipe(
      switchMap(([t, s]) => this.adminApi.getTeams(t.slug, s.id)),
      shareReplay(1)
    );
  }

  refresh() {
    this.refreshSub.next(false);
  }

  markPaid(team: ITeamSummary): void {
    this.subscriptions.add(combineLatest([this.state.tenant$, this.state.season$]).pipe(
      take(1),
      switchMap(([t, s]) => this.adminApi.markTeamAsPaid(t.slug, s.id, team.id))
    ).subscribe(() => this.refresh()));
  }

  markUnpaid(team: ITeamSummary): void {
    this.subscriptions.add(combineLatest([this.state.tenant$, this.state.season$]).pipe(
      take(1),
      switchMap(([t, s]) => this.adminApi.markTeamAsUnpaid(t.slug, s.id, team.id))
    ).subscribe(() => this.refresh()));
  }
}
