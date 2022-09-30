import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DefaultDaterangepickerConfig } from 'src/app/modules/admin/admin.types';
import { formatDateOnly } from 'src/app/shared/helpers';
import { IPublicTenant } from 'src/app/types/public.types';
import { TenantStateService } from '../../tenant/tenant-state.service';
import { TenantAdminService } from '../tenant-admin.service';
import { ISeasonView, ITradePeriod } from '../tenant-admin.types';

interface ITradePeriodForm {
  id?: string;
  period: Date[];
  tradeLimit: number;
}

interface IModel {
  tenant: IPublicTenant;
  season: ISeasonView;
}

@Component({
  templateUrl: './trade-period-list.component.html',
  styleUrls: ['./trade-period-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradePeriodListComponent implements OnInit {
  refreshSub = new BehaviorSubject<boolean>(true);

  tradePeriods$: Observable<ITradePeriod[]>;
  model$: Observable<IModel>;

  bsDatepickerOpts = DefaultDaterangepickerConfig;

  defaultNewTradePeriod: ITradePeriodForm = {
    period: [null, null],
    tradeLimit: 0
  };
  newTradePeriod: ITradePeriodForm = { ...this.defaultNewTradePeriod };

  editIndex: number | null = null;
  private editTradePeriodSub = new BehaviorSubject<ITradePeriodForm>(undefined);
  editTradePeriod$: Observable<ITradePeriodForm> = this.editTradePeriodSub.asObservable();

  modalRef: BsModalRef;

  constructor(private state: TenantStateService, private adminApi: TenantAdminService,
    private cd: ChangeDetectorRef, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.model$ = combineLatest([this.state.tenant$, this.state.season$]).pipe(
      map(([t, s]) => ({ tenant: t, season: s}))
    );

    this.tradePeriods$ = combineLatest([this.state.tenant$, this.state.season$, this.refreshSub]).pipe(
      switchMap(([t, s]) => this.adminApi.getTradePeriods(t.slug, s.id))
    );
  }

  refresh() {
    this.refreshSub.next(false);
  }

  addTradePeriod(tenantSlug: string, seasonId: string) {
    if (this.isValidTradePeriod(this.newTradePeriod)) {
      const sub = this.adminApi.addTradePeriod(tenantSlug, seasonId, {
        startDate: formatDateOnly(this.newTradePeriod.period[0]),
        endDate: formatDateOnly(this.newTradePeriod.period[1]),
        tradeLimit: this.newTradePeriod.tradeLimit
      })
        .subscribe(() => {
          this.refresh();
          this.newTradePeriod = { ...this.defaultNewTradePeriod };
          sub.unsubscribe();
        });
    }
  }

  isValidTradePeriod(tradePeriod: ITradePeriodForm) {
    return tradePeriod != null
      && tradePeriod.period
      && tradePeriod.period.length === 2
      && tradePeriod.period[0] != null
      && tradePeriod.period[1] != null
      && tradePeriod.tradeLimit > 0
      && tradePeriod.period[0] < tradePeriod.period[1];
  }

  cancelAddTradePeriod() {
    this.newTradePeriod = { ...this.defaultNewTradePeriod };

    setTimeout(() => this.cd.detectChanges());
  }

  updateTradePeriodStart(tp: ITradePeriod, index: number) {
    this.editIndex = index;
    this.editTradePeriodSub.next({ period: [ new Date(tp.startDate), new Date(tp.endDate)], tradeLimit: tp.tradeLimit, id: tp.id });
  }

  deleteTradePeriodStart(tp: ITradePeriod, template: TemplateRef<any>) {
    this.editTradePeriodSub.next({ id: tp.id, period: [], tradeLimit: tp.tradeLimit});
    this.modalRef = this.modalService.show(template);
  }

  deleteTradePeriod(tenantSlug: string, seasonId: string, tp: ITradePeriodForm) {
    const sub = this.adminApi.deleteTradePeriod(tenantSlug, seasonId, tp.id)
      .subscribe(() => {
        this.editTradePeriodSub.next(undefined);
        this.refresh();
        sub.unsubscribe();
      });

    this.modalRef.hide();
  }

  cancelDeleteTradePeriod() {
    this.editTradePeriodSub.next(undefined);
    this.modalRef.hide();
  }

  updateTradePeriod(tenantSlug: string, seasonId: string, tradePeriod: ITradePeriodForm) {
    if (this.isValidTradePeriod(tradePeriod)) {
      const sub = this.adminApi.updateTradePeriod(tenantSlug, seasonId, tradePeriod.id, {
        startDate: formatDateOnly(tradePeriod.period[0]),
        endDate: formatDateOnly(tradePeriod.period[1]),
        tradeLimit: tradePeriod.tradeLimit
      }).subscribe(() => {
        this.refreshSub.next(false);
        this.cancelUpdateTradePeriod();
        sub.unsubscribe();
      });
    }
  }

  cancelUpdateTradePeriod() {
    this.editIndex = null;
    this.editTradePeriodSub.next(undefined);
  }

}
