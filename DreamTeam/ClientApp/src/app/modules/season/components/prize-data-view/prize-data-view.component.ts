import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPrizeReport, IPublicSeasonInfo, SeasonStateType } from 'src/app/types/public.types';

@Component({
  selector: 'app-prize-data-view',
  templateUrl: './prize-data-view.component.html',
  styleUrls: ['./prize-data-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrizeDataViewComponent implements OnInit {

  @Input() season: IPublicSeasonInfo;

  prizes$: Observable<IPrizeReport[]>;
  SeasonStateType = SeasonStateType;

  constructor(private publicApi: PublicApiService) { }

  ngOnInit(): void {
    this.prizes$ = this.publicApi.getPrizeReport(this.season.id);
  }

}
