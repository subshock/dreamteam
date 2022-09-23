import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { ITenant } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantListComponent implements OnInit {

  reloadSub = new BehaviorSubject<boolean>(true);
  tenants$: Observable<ITenant[]>;

  constructor(private adminApi: AdminApiService) { }

  ngOnInit(): void {
    this.tenants$ = this.reloadSub.pipe(
      switchMap(() => this.adminApi.listTenants()),
      shareReplay(1)
    );
  }

  reload(): void {
    this.reloadSub.next(false);
  }
}
