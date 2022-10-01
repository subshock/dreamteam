import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { ISeasonContent } from 'src/app/types/public.types';
import { TenantAdminService } from '../../tenant-admin.service';

@Component({
  templateUrl: './season-content-editor.component.html',
  styleUrls: ['./season-content-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonContentEditorComponent implements OnInit, OnDestroy {

  tenantSlug: string;
  seasonId: string;
  name: string;

  data$: Observable<ISeasonContent>;
  subscriptions: Subscription;

  constructor(private adminApi: TenantAdminService, private modalRef: BsModalRef) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();
    this.data$ = this.adminApi.getSeasonContent(this.tenantSlug, this.seasonId, this.name);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cancel(): void {
    this.modalRef.hide();
  }

  save(model: ISeasonContent): void {
    this.subscriptions.add(
      this.adminApi.updateSeasonContent(this.tenantSlug, this.seasonId, model).subscribe(() => {
        this.modalRef.hide();
      })
    );
  }
}
