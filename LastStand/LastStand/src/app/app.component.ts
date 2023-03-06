import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { filter, finalize, interval, map, Observable, switchMap, takeWhile, tap, timer } from 'rxjs';
import { ICompetition } from './laststand.types';
import { LastStandStateService } from './services/laststand-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [LastStandStateService]
})
export class AppComponent {
  title = 'LastStand';
  loading: boolean = true;

  competition$: Observable<ICompetition>;
  expiry$: Observable<{ days: number; hours: number; minutes: number; seconds: number; state: number; }>;

  constructor(private state: LastStandStateService, private titleSvc: Title, private router: Router) {
    this.competition$ = state.competition$.pipe(
      tap(comp => {
        this.titleSvc.setTitle(comp.name);
      }),
      finalize(() => this.loading = false),
    );
    this.expiry$ = state.competition$.pipe(
      filter(x => x.registrationOpen),
      map(x => new Date(x.registrationEnds)),
      switchMap(x => timer(0, 1000).pipe(map(() => {
        const now = new Date();
        const diff = x.getTime() - now.getTime();
        console.info('tick');

        if (diff < 0) {
          this.state.refresh();
          return { state: 3, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));
        const state = days + hours + minutes + seconds === 0
          ? 2 : days + hours === 0 ? 1 : 0;

        return { days, hours, minutes, seconds, state };
      }))),
      takeWhile(x => x.state !== 3)
    );
  }
}
