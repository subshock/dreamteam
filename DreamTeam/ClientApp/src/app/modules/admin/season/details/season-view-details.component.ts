import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ISeasonView } from '../../admin.types';
import { AdminSeasonStateService } from '../../services/season-state.service';
import { SeasonEditorComponent } from '../editor/season-editor.component';
import { SeasonChangeStatusComponent } from '../status/season-change-status.component';

@Component({
  templateUrl: './season-view-details.component.html',
  styleUrls: ['./season-view-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonViewDetailsComponent implements OnInit {

  modalRef: BsModalRef;

  season$: Observable<ISeasonView>;

  constructor(private state: AdminSeasonStateService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.season$ = this.state.season$;
  }

  updateSeason(season: ISeasonView) {
    this.modalRef = this.modalService.show(SeasonEditorComponent, { initialState: { seasonId: season.id, mode: 'update' } });
    const sub = this.modalRef.onHide.subscribe(() => {
      if (this.modalRef.content.result !== false) {
        this.state.refreshSeason();
      }
      sub.unsubscribe();
    });
  }

  changeStatus(season: ISeasonView) {
    this.modalRef = this.modalService.show(SeasonChangeStatusComponent, { initialState: { season: season } });
    const sub = this.modalRef.onHide.subscribe(() => {
      if (this.modalRef.content.result) {
        this.state.refreshSeason();
      }
      sub.unsubscribe();
    });
  }
}
