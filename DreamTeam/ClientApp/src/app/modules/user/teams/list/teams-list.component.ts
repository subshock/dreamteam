import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserApiService } from 'src/app/services/user-api.service';
import { IPublicSeasonInfo, IUserTeamSummary, SeasonStateType } from 'src/app/types/public.types';

interface IModel {
  teams: IUserTeamSummary[];
  season: IPublicSeasonInfo;
}

@Component({
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsListComponent implements OnInit {

  private refreshSub = new BehaviorSubject<boolean>(true);
  model$: Observable<IModel>;
  SeasonStateType = SeasonStateType;

  constructor(private userApi: UserApiService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.model$ = this.refreshSub.pipe(switchMap(() => zip(this.userApi.publicApi.getCurrentSeason(), this.userApi.getUserTeams())),
      map(([s, t]) => ({ teams: t, season: s}))
    );
  }

  reload(): void {
    this.refreshSub.next(false);
  }
}
