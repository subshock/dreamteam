import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DateTime } from 'luxon';
import { interval, Observable, Subscription, timer } from 'rxjs';
import { filter, map, share, startWith, take } from 'rxjs/operators';
import { IPublicTradePeriod, TradePeriodType } from 'src/app/types/public.types';

interface ICountdownModel {
  active: boolean;
  endDate: DateTime;
  breakdown?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

@Component({
  selector: 'app-trade-countdown',
  templateUrl: './trade-countdown.component.html',
  styleUrls: ['./trade-countdown.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeCountdownComponent implements OnInit, OnDestroy {

  TradePeriodType = TradePeriodType;

  @Input() tradePeriod: IPublicTradePeriod;

  @Output() expired = new EventEmitter();

  countdown$: Observable<ICountdownModel>;

  private subscriptions: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();
    const endDate = DateTime.fromISO(this.tradePeriod.endDate);
    this.countdown$ = interval(1000).pipe(
      map(() => ({
        now: DateTime.now(),
      })),
      map(m => ({
        active: endDate > m.now,
        endDate: endDate,
        breakdown: endDate > m.now ? this.calculateBreakdown(endDate, m.now) : null
      })),
      startWith(),
      share()
    );

    this.subscriptions.add(this.countdown$.pipe(
      filter(m => !m.active),
      take(1)
    ).subscribe(() => this.expired.emit()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateBreakdown(endDate: DateTime, now: DateTime): { days: number; hours: number; minutes: number; seconds: number; } {
    const diff = endDate.diff(now, ['days', 'hours', 'minutes', 'seconds']);

    const ret = {
      days: diff.days,
      hours: diff.hours,
      minutes: diff.minutes,
      seconds: Math.floor(diff.seconds)
    };

    return ret;
  }
}
