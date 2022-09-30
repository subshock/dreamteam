import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IPublicSeasonInfo, IUserTeamSummary, SeasonStateType } from 'src/app/types/public.types';
import { TeamEditorComponent } from './editor/team-editor.component';

@Component({
  selector: 'app-user-team-data-view',
  templateUrl: './user-team-data-view.component.html',
  styleUrls: ['./user-team-data-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTeamDataViewComponent implements OnInit {

  @Input() teams: IUserTeamSummary[];
  @Input() season: IPublicSeasonInfo;

  @Output() teamUpdate = new EventEmitter<string>();

  SeasonStateType = SeasonStateType;

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  updateTeam(team: IUserTeamSummary): void {
    const modalRef = this.modalService.show(TeamEditorComponent, { initialState: { teamId: team.id } });

    const sub = modalRef.onHide.subscribe(() => {
      sub.unsubscribe();
      if (modalRef.content.result) {
        this.teamUpdate.emit(team.id);
      }
    });
  }
}
