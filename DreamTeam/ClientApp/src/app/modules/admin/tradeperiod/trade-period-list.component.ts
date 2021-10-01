import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { formatDateOnly } from 'src/app/shared/helpers';
import { DefaultDaterangepickerConfig, ISeasonView, ITradePeriod, ITradePeriodUpdate } from '../admin.types';
import { AdminApiService } from '../services/admin-api.service';
import { AdminSeasonStateService } from '../services/season-state.service';

interface ITradePeriodForm {
  id?: string;
  period: Date[];
  tradeLimit: number;
}

@Component({
  templateUrl: './trade-period-list.component.html',
  styleUrls: ['./trade-period-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradePeriodListComponent implements OnInit {
  refreshSub = new BehaviorSubject<boolean>(true);

  tradePeriods$: Observable<ITradePeriod[]>;
  season$: Observable<ISeasonView>;

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

  constructor(private state: AdminSeasonStateService, private adminApi: AdminApiService,
    private cd: ChangeDetectorRef, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.season$ = this.state.season$;

    this.tradePeriods$ = combineLatest([this.state.season$, this.refreshSub]).pipe(
      switchMap(([s]) => this.adminApi.getTradePeriods(s.id))
    );
  }

  refresh() {
    this.refreshSub.next(false);
  }

  addTradePeriod(seasonId: string) {
    if (this.isValidTradePeriod(this.newTradePeriod)) {
      const sub = this.adminApi.addTradePeriod(seasonId, {
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

  deleteTradePeriod(seasonId: string, tp: ITradePeriodForm) {
    const sub = this.adminApi.deleteTradePeriod(seasonId, tp.id)
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

  updateTradePeriod(seasonId: string, tradePeriod: ITradePeriodForm) {
    if (this.isValidTradePeriod(tradePeriod)) {
      const sub = this.adminApi.updateTradePeriod(seasonId, tradePeriod.id, {
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
