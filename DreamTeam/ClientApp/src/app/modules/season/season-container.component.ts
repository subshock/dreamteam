import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IPublicSeasonInfo } from 'src/app/types/public.types';
import { PublicSeasonStateService } from './public-season-state.service';

@Component({
  template: `
    <ng-container *ngIf="season$ | async as season">
      <app-season-header [season]="season"></app-season-header>
      <router-outlet></router-outlet>
    </ng-container>
  `,
  providers: [PublicSeasonStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonContainerComponent implements OnInit, OnDestroy {

  season$: Observable<IPublicSeasonInfo>;
  private subscriptions: Subscription;
  constructor(private state: PublicSeasonStateService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.season$ = this.state.season$;
    this.subscriptions = this.route.paramMap.pipe(map(p => p.get('id'))).subscribe(id => this.state.setSeasonId(id));
    this.subscriptions.add(this.state.season$.pipe(catchError(() => {
      this.router.navigate(['/']);
      return EMPTY;
    })).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
