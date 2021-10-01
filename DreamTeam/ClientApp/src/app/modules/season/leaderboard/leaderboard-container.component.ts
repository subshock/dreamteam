import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PublicSeasonStateService } from '../public-season-state.service';

@Component({
  templateUrl: './leaderboard-container.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardContainerComponent implements OnInit {

  model$: Observable<any>;

  constructor(private state: PublicSeasonStateService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.model$ = this.route.data.pipe(
      map(d => ({ data: d }))
    );
  }

}
