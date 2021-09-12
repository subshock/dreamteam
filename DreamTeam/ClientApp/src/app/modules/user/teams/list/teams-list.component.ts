import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SeasonStateType } from 'src/app/modules/admin/admin.types';
import { PublicApiService } from 'src/app/services/public-api.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { IPublicSeasonInfo, IUserTeamSummary } from 'src/app/types/public.types';
import { TeamEditorComponent } from '../editor/team-editor.component';

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
    const teamObs = this.refreshSub.pipe(switchMap(() => this.userApi.getUserTeams()));
    this.model$ = combineLatest([this.userApi.publicApi.getCurrentSeason(), teamObs]).pipe(
      map(([s, t]) => ({ teams: t, season: s}))
    );
  }

  updateTeam(team: any) {
    const modalRef = this.modalService.show(TeamEditorComponent, { initialState: { teamId: team.id } });

    const sub = modalRef.onHide.subscribe(() => {
      sub.unsubscribe();
      if (modalRef.content.result) {
        this.refreshSub.next(false);
      }
    });
  }
}
