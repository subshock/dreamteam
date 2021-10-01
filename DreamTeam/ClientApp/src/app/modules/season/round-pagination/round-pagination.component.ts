import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPublicSeasonInfo } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

@Component({
  selector: 'app-round-pagination',
  templateUrl: './round-pagination.component.html',
  styleUrls: ['./round-pagination.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPaginationComponent implements OnInit {

  @Input() type: string;

  model$: Observable<{ season: IPublicSeasonInfo; rounds: any[]; }>;

  constructor(private publicApi: PublicApiService, private state: PublicSeasonStateService) { }

  ngOnInit(): void {
    this.model$ = this.state.season$.pipe(
      switchMap(s => this.publicApi.getCompletedRounds(s.id).pipe(map(rs => ({ season: s, rounds: rs }))))
    );
  }

}
