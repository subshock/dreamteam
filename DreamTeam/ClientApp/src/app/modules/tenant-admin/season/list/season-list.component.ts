import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SeasonEditorComponent } from '../editor/season-editor.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantAdminService } from '../../tenant-admin.service';
import { IPublicTenant } from 'src/app/types/public.types';
import { TenantStateService } from '../../../tenant/tenant-state.service';
import { map, switchMap, take } from 'rxjs/operators';
import { ISeasonSummary } from '../../tenant-admin.types';

interface IModel {
  tenant: IPublicTenant;
  seasons: ISeasonSummary[];
}
@Component({
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonListComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;

  model$: Observable<IModel>;

  subscriptions: Subscription;

  constructor(private adminApi: TenantAdminService, private modalService: BsModalService, /*private adminState: AdminStateService,*/
    private state: TenantStateService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();

    // this.adminState.addNavItem({ id: AdminNavItemId.Seasons, name: 'Seasons', route: ['/admin/season'] });
    this.model$ = this.state.tenant$.pipe(
      switchMap(t => this.adminApi.getSeasons(t.slug).pipe(map(s => ({ tenant: t, seasons: s }))))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    // this.adminState.removeNavItem(AdminNavItemId.Seasons);
  }

  addSeason() {
    this.subscriptions.add(
      this.state.tenant$.pipe(
        take(1)
      ).subscribe(t => {
        this.modalRef = this.modalService.show(SeasonEditorComponent, { initialState: { mode: 'add', tenantSlug: t.slug } });
        const sub = this.modalRef.onHide.subscribe(() => {
          if (this.modalRef.content.result !== false) {
            this.router.navigate(['./', 'season', this.modalRef.content.result.id], { relativeTo: this.route });
          }
          sub.unsubscribe();
        });
      })
    );
  }
}
