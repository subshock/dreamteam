import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LastStandStateService } from '../../../services/laststand-state.service';
import { AdminApiService } from '../../../services/admin-api.service';
import { IEntry } from '../../../laststand.admin.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-last-stand-entries',
  templateUrl: './last-stand-entries.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LastStandEntriesComponent implements OnInit {
  private refreshSub = new BehaviorSubject<boolean>(true);
  entries$: Observable<IEntry[]>;

  constructor(private state: LastStandStateService, private adminSvc: AdminApiService) { }

  ngOnInit(): void {
    this.entries$ = this.state.competition$.pipe(
      switchMap(c => this.refreshSub.pipe(map(() => c))),
      switchMap(c => this.adminSvc.getLastStandEntries(c.id))
    );
  }

  reload(): void {
    this.refreshSub.next(false);
  }
}
