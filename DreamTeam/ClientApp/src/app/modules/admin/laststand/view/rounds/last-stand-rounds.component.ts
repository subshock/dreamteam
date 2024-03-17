import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LastStandStateService } from '../../../services/laststand-state.service';
import { AdminApiService } from '../../../services/admin-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRound } from '../../../laststand.admin.types';
import { map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-last-stand-rounds',
  templateUrl: './last-stand-rounds.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LastStandRoundsComponent implements OnInit {

  private refreshSub = new BehaviorSubject<boolean>(false);
  rounds$: Observable<IRound[]>;

  resultIndex = -1;
  resultUpdateVal: number;

  constructor(private state: LastStandStateService, private adminSvc: AdminApiService) { }

  ngOnInit(): void {
    this.rounds$ = this.state.competition$.pipe(
      switchMap(c => this.refreshSub.pipe(map(() => c))),
      switchMap(c => this.adminSvc.getLastStandRounds(c.id))
    );
  }

  reload(): void {
    this.refreshSub.next(false);
  }

  startResultUpdate(round: IRound, index: number): void {
    this.resultUpdateVal = round.result;
    this.resultIndex = index;
  }

  saveResultUpdate(round: IRound): void {
    if (this.resultUpdateVal >= 0 && this.resultUpdateVal <= 3) {
      this.adminSvc.updateLastStandRoundResult(round.competitionId, round.id, this.resultUpdateVal).pipe(take(1)).subscribe(() => this.reload());
    }

    this.resultIndex = -1;
  }

  cancelResultUpdate(): void {
    this.resultIndex = -1;
  }
}
