import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SeasonStateType } from 'src/app/modules/admin/admin.types';
import { PublicApiService } from 'src/app/services/public-api.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { IPublicSeasonInfo } from 'src/app/types/public.types';

interface IModel {
  teams: any[];
  season: IPublicSeasonInfo;
}

@Component({
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsListComponent implements OnInit {

  model$: Observable<IModel>;
  SeasonStateType = SeasonStateType;

  constructor(private userApi: UserApiService) { }

  ngOnInit(): void {
    this.model$ = combineLatest([this.userApi.publicApi.getCurrentSeason(), this.userApi.getUserTeams()]).pipe(
      map(([s, t]) => ({ teams: t, season: s}))
    );
  }

}
