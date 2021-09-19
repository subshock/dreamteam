import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SeasonStateType } from '../modules/admin/admin.types';
import { PublicApiService } from '../services/public-api.service';
import { IPublicSeasonInfo } from '../types/public.types';

@Component({
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulesComponent implements OnInit {

  season$: Observable<IPublicSeasonInfo>;

  constructor(private publicApi: PublicApiService) { }

  ngOnInit(): void {
    this.season$ = this.publicApi.getCurrentSeason().pipe(filter(x => x.status > SeasonStateType.Setup));
  }

}
