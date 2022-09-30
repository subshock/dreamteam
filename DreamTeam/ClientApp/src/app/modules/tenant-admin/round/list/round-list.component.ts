import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { TenantStateService } from '../../../tenant/tenant-state.service';
import { TenantAdminService } from '../../tenant-admin.service';
import { IRoundSummary, RoundStateType } from '../../tenant-admin.types';
import { RoundEditorComponent } from '../editor/round-editor.component';

export interface IRoundModel extends IRoundSummary {
  canEdit?: boolean;
}

@Component({
  templateUrl: './round-list.component.html',
  styleUrls: ['./round-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundListComponent implements OnInit, OnDestroy {

  refreshSub = new BehaviorSubject<boolean>(true);
  rounds$: Observable<IRoundModel[]>;

  private subscriptions: Subscription;

  deleteObj: IRoundModel;
  modalRef?: BsModalRef;

  constructor(private state: TenantStateService, private adminApi: TenantAdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();
    this.rounds$ = combineLatest([this.state.tenant$, this.state.season$, this.refreshSub]).pipe(
      switchMap(([t, s]) => this.adminApi.getRounds(t.slug, s.id)),
      map(r => r.map(x => ({ ...x, canEdit: x.status === RoundStateType.Creating })))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  refresh(includeSeason?: boolean) {
    this.refreshSub.next(false);
    if (!!includeSeason) {
      this.state.refreshSeason();
    }
  }

  addRound() {
    this.subscriptions.add(combineLatest([this.state.tenant$, this.state.season$]).pipe(take(1)).subscribe(([t, s]) => {
      const ref = this.modalService.show(RoundEditorComponent, { initialState: { tenantSlug: t.slug, seasonId: s.id, mode: 'add' } });

      const sub1 = ref.onHidden.subscribe(result => {
        if (ref.content.result !== false) {
          this.refresh(true);
        }

        sub1.unsubscribe();
      });
    }));
  }

  updateRound(round: IRoundModel) {
    if (round.canEdit) {
      this.subscriptions.add(combineLatest([this.state.tenant$, this.state.season$]).pipe(take(1)).subscribe(([t, s]) => {
        const ref = this.modalService.show(RoundEditorComponent, {
          initialState: {
            tenantSlug: t.slug, seasonId: s.id, roundId: round.id, mode: 'update'
          }
        });

        const sub1 = ref.onHidden.subscribe(result => {
          if (ref.content.result !== false) {
            this.refresh(true);
          }

          sub1.unsubscribe();
        });
      }));
    }
  }

  deleteRoundStart(round: IRoundModel, template: TemplateRef<any>) {
    if (round.canEdit) {
      this.deleteObj = round;
      this.modalRef = this.modalService.show(template);
    }
  }

  deleteRound(round: IRoundSummary) {
    this.modalRef.hide();
    const sub = combineLatest([this.state.tenant$, this.state.season$]).pipe(
      take(1),
      switchMap(([t, s]) => this.adminApi.deleteRound(t.slug, s.id, round.id))
    ).subscribe(() => {
      sub.unsubscribe();
      this.refresh(true);
    });
  }
}
