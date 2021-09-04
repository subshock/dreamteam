import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ISeasonView } from '../../admin.types';
import { SeasonStateService } from '../../services/season-state.service';

@Component({
  templateUrl: 'season-view-container.component.html',
  styleUrls: ['season-view-container.component.less'],
  providers: [SeasonStateService]
})

export class SeasonViewContainerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;

  season$: Observable<ISeasonView>;
  tabs$: Observable<{ [key: string]: boolean }>;

  constructor(private route: ActivatedRoute, private state: SeasonStateService) { }

  ngOnInit() {
    this.subscriptions = new Subscription();

    this.season$ = this.state.season$;
    this.tabs$ = this.state.tabs$;

    this.subscriptions.add(this.route.paramMap.subscribe(p => {
      this.state.setSeasonId(p.get('id'));
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
