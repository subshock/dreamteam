import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { IPrize } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';
import { AdminSeasonStateService } from '../../services/season-state.service';
import { PrizeEditorComponent } from '../editor/prize-editor.component';

@Component({
  templateUrl: './prize-list.component.html',
  styleUrls: ['./prize-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrizeListComponent implements OnInit, OnDestroy {

  private refreshSub = new BehaviorSubject<boolean>(true);
  prizes$: Observable<IPrize[]>;

  private subscriptions: Subscription;
  modalRef: BsModalRef;
  deleteObj: IPrize;

  constructor(private state: AdminSeasonStateService, private adminApi: AdminApiService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();

    this.prizes$ = combineLatest([this.state.season$, this.refreshSub]).pipe(
      switchMap(([s]) => this.adminApi.getPrizes(s.id))
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

  addPrize() {
    this.subscriptions.add(this.state.season$.pipe(take(1)).subscribe(s => {
      const ref = this.modalService.show(PrizeEditorComponent, { initialState: { seasonId: s.id, mode: 'add' } });

      const sub1 = ref.onHidden.subscribe(result => {
        this.refresh(true);
        sub1.unsubscribe();
      });
    }));
  }

  updatePrize(prize: IPrize) {
    this.subscriptions.add(this.state.season$.pipe(take(1)).subscribe(s => {
      const ref = this.modalService.show(PrizeEditorComponent, { initialState: { seasonId: s.id, prizeId: prize.id, mode: 'update' } });

      const sub1 = ref.onHidden.subscribe(() => {
        if (ref.content.result !== false) {
          this.refresh(true);
        }

        sub1.unsubscribe();
      });
    }));
  }

  deletePrizeStart(prize: IPrize, template: TemplateRef<any>) {
    this.deleteObj = prize;
    this.modalRef = this.modalService.show(template);
  }

  deletePrize(prize: IPrize) {
    this.modalRef.hide();
    const sub = this.state.season$.pipe(
      take(1),
      switchMap(s => this.adminApi.deletePrize(s.id, prize.id))
    ).subscribe(() => {
      sub.unsubscribe();
      this.refresh(true);
    });
  }
}
