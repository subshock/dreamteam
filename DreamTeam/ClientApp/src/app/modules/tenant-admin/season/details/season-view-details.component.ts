import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPublicTenant } from 'src/app/types/public.types';
import { TenantStateService } from '../../../tenant/tenant-state.service';
import { ISeasonView } from '../../tenant-admin.types';
import { SeasonContentEditorComponent } from '../content/season-content-editor.component';
import { SeasonEditorComponent } from '../editor/season-editor.component';
import { SeasonChangeStatusComponent } from '../status/season-change-status.component';

interface IModel {
  tenant: IPublicTenant;
  season: ISeasonView;
}

@Component({
  templateUrl: './season-view-details.component.html',
  styleUrls: ['./season-view-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonViewDetailsComponent implements OnInit {

  modalRef: BsModalRef;

  model$: Observable<IModel>;

  constructor(private state: TenantStateService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.model$ = combineLatest([this.state.tenant$, this.state.season$]).pipe(
      map(([t, s]) => ({ tenant: t, season: s }))
    );
  }

  updateSeason(model: IModel) {
    this.modalRef = this.modalService.show(SeasonEditorComponent, {
      initialState: {
        tenantSlug: model.tenant.slug, seasonId: model.season.id, mode: 'update'
      }
    });
    const sub = this.modalRef.onHide.subscribe(() => {
      if (this.modalRef.content.result !== false) {
        this.state.refreshSeason();
      }
      sub.unsubscribe();
    });
  }

  changeStatus(model: IModel) {
    this.modalRef = this.modalService.show(SeasonChangeStatusComponent, {
      initialState: {
        tenantSlug: model.tenant.slug, season: model.season
      }
    });
    const sub = this.modalRef.onHide.subscribe(() => {
      if (this.modalRef.content.result) {
        this.state.refreshSeason();
      }
      sub.unsubscribe();
    });
  }

  updateRules(model: IModel): void {
    this.modalRef = this.modalService.show(SeasonContentEditorComponent, {
      class: 'modal-lg',
      initialState: {
        tenantSlug: model.tenant.slug,
        seasonId: model.season.id,
        name: 'Rules'
      }
    });
  }
}
