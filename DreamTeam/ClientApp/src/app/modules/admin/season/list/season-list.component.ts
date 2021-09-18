import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiService } from '../../services/admin-api.service';
import { AdminNavItemId, ISeasonSummary } from '../../admin.types';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SeasonEditorComponent } from '../editor/season-editor.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminStateService } from '../../services/admin-state.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonListComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;

  seasons$: Observable<ISeasonSummary[]>;

  constructor(private adminApi: AdminApiService, private modalService: BsModalService, private adminState: AdminStateService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.adminState.addNavItem({ id: AdminNavItemId.Seasons, name: 'Seasons', route: ['/admin/season'] });
    this.seasons$ = this.adminApi.getSeasons().pipe(
      tap(seasons => {
        // TODO: remove once we properly support multiple seasons
        if (seasons.length === 1) {
          this.router.navigate(['./', seasons[0].id], { relativeTo: this.route });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.adminState.removeNavItem(AdminNavItemId.Seasons);
  }

  addSeason() {
    this.modalRef = this.modalService.show(SeasonEditorComponent, { initialState: { mode: 'add' } });
    const sub = this.modalRef.onHide.subscribe(() => {
      if (this.modalRef.content.result !== false) {
        this.router.navigate(['./', this.modalRef.content.result.id], { relativeTo: this.route });
      }
      sub.unsubscribe();
    });
  }
}
