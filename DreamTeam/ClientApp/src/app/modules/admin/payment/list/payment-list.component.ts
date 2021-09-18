import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { formatDateOnly } from 'src/app/shared/helpers';
import { AdminNavItemId, IPaymentSearch, IPaymentSummary, PaymentSearchStatusType } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';
import { AdminStateService } from '../../services/admin-state.service';

declare var window: any;

@Component({
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentListComponent implements OnInit, OnDestroy {

  private refreshSub = new BehaviorSubject<boolean>(true);
  private searchSub = new ReplaySubject<IPaymentSearch>();

  searchForm: FormGroup = new FormGroup({
    'range': new FormControl([null, null], Validators.required),
    'token': new FormControl(''),
    'status': new FormControl(PaymentSearchStatusType.Any, Validators.required)
  });

  bsDatepickerOpts?: Partial<BsDaterangepickerConfig> = {
    showWeekNumbers: false,
    containerClass: 'theme-dark-blue',
    rangeInputFormat: 'ddd D MMM YYYY',
    rangeSeparator: ' - '
  };

  results$: Observable<IPaymentSummary[]>;

  constructor(private adminApi: AdminApiService) { }

  ngOnInit(): void {
    this.results$ = combineLatest([this.searchSub, this.refreshSub]).pipe(
      switchMap(([s]) => this.adminApi.searchPayments(s))
    );

    this.initializeSearch();
  }

  ngOnDestroy(): void {
  }

  private initializeSearch() {
    const obj: IPaymentSearch = window.localStorage && window.localStorage.getItem('admin.payment.search')
      && JSON.parse(window.localStorage.getItem('admin.payment.search')) || {
      from: DateTime.local().startOf('month').toISODate(),
      to: DateTime.local().startOf('day').toISODate(),
      token: '',
      status: PaymentSearchStatusType.Any
    };

    this.searchForm.setValue({
      range: [new Date(obj.from), new Date(obj.to)],
      token: obj.token,
      status: obj.status
    });

    this.searchSub.next(obj);
  }

  search(): void {
    if (this.searchForm.valid) {
      const val = this.searchForm.value;

      const obj: IPaymentSearch = {
        from: DateTime.fromJSDate(val.range[0]).startOf('day').toISODate(),
        to: DateTime.fromJSDate(val.range[1]).startOf('day').toISODate(),
        token: val.token,
        status: val.status
      };

      if (window.localStorage) {
        window.localStorage.setItem('admin.payment.search', JSON.stringify(obj));
      }

      this.searchSub.next(obj);
    }
  }

  refresh(): void {
    this.refreshSub.next(false);
  }
}
