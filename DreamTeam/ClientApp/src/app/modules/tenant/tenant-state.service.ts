import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPublicTenant } from 'src/app/types/public.types';
import { TenantAdminService } from '../tenant-admin/tenant-admin.service';
import { ISeasonView } from '../tenant-admin/tenant-admin.types';

@Injectable({
  providedIn: 'root'
})
export class TenantStateService {

  static nextId = 0;

  private tenantSubject = new ReplaySubject<IPublicTenant>();
  private tenant: IPublicTenant;
  private seasonIdSubject = new ReplaySubject<string>();
  private seasonId: string;
  private id = TenantStateService.nextId++;

  season$: Observable<ISeasonView>;
  tenant$: Observable<IPublicTenant>;

  private tabsSubject = new BehaviorSubject<{ [key: string]: boolean }>(
    { 'details': true, 'players': true, 'teams': true, 'rounds': true, 'trade-periods': true, 'prizes': true });
  tabs$: Observable<{ [key: string]: boolean }> = this.tabsSubject.asObservable();

  constructor(private adminSvc: TenantAdminService, publicApi: PublicApiService) {
    this.tenant$ = this.tenantSubject.pipe(
      shareReplay(1)
    );

    this.season$ = combineLatest([this.tenant$, this.seasonIdSubject]).pipe(
      switchMap(([tenant, id]) => this.adminSvc.getSeason(tenant.slug, id)),
      shareReplay(1)
    );
  }

  setTenant(tenant: IPublicTenant) {
    this.tenant = tenant;
    this.tenantSubject.next(tenant);
  }

  setSeasonId(id: string) {
    this.seasonId = id;
    this.seasonIdSubject.next(id);
  }

  refreshSeason() {
    this.seasonIdSubject.next(this.seasonId);
  }

  setTabExclusive(tab: string) {
    const tabs = { ...this.tabsSubject.value };

    for (const key in tabs) {
      if (tabs.hasOwnProperty(key)) {
        tabs[key] = key === tab;
      }
    }

    this.tabsSubject.next(tabs);
  }

  resetTabs() {
    const tabs = { ...this.tabsSubject.value };

    for (const key in tabs) {
      if (tabs.hasOwnProperty(key)) {
        tabs[key] = true;
      }
    }

    this.tabsSubject.next(tabs);
  }
}
