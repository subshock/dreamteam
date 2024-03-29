import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TenantStateService } from '../../../tenant/tenant-state.service';
import { ISeasonView } from '../../tenant-admin.types';

@Component({
  templateUrl: 'season-view-container.component.html',
  styleUrls: ['season-view-container.component.less'],
})

export class SeasonViewContainerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;

  season$: Observable<ISeasonView>;
  tabs$: Observable<{ [key: string]: boolean }>;

  constructor(private route: ActivatedRoute, private state: TenantStateService /*, private adminState: AdminStateService */) { }

  ngOnInit() {
    // this.adminState.addNavItem({ id: AdminNavItemId.Seasons, name: 'Seasons', route: ['/admin/season'] });
    this.subscriptions = new Subscription();

    this.season$ = this.state.season$.pipe(tap(season => {
      // this.adminState.addNavItem({
      //   id: AdminNavItemId.SeasonView,
      //   name: season.name,
      //   bold: true,
      //   route: ['/', 'admin', 'season', season.id]
      // });
    }));
    this.tabs$ = this.state.tabs$;

    this.subscriptions.add(this.route.paramMap.subscribe(p => {
      this.state.setSeasonId(p.get('id'));
    }));
  }

  ngOnDestroy() {
    // this.adminState.removeNavItem(AdminNavItemId.Seasons);
    this.subscriptions.unsubscribe();
  }
}
