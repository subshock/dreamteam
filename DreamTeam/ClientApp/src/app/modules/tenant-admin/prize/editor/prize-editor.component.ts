import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DefaultDatepickerConfig } from 'src/app/modules/admin/admin.types';
import { formatDateOnly } from 'src/app/shared/helpers';
import { TenantAdminService } from '../../tenant-admin.service';
import { IPrize, IPrizeUpdate } from '../../tenant-admin.types';

@Component({
  templateUrl: './prize-editor.component.html',
  styleUrls: ['./prize-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrizeEditorComponent implements OnInit {

  private defaultPrize: Partial<IPrize> = {
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    position: 1
  };

  mode: 'add' | 'update';
  tenantSlug: string;
  seasonId: string;
  prizeId: string;
  result = false;

  prizeForm: FormGroup;
  dataSub$: Observable<any>;

  bsDatePickerOpts = DefaultDatepickerConfig;

  constructor(private adminApi: TenantAdminService, private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.dataSub$ = (this.mode === 'add' ? of(this.defaultPrize) : this.adminApi.getPrize(this.tenantSlug, this.seasonId, this.prizeId))
      .pipe(
        tap(r => {
          this.prizeForm = new FormGroup({
            'name': new FormControl(r.name, Validators.required),
            'description': new FormControl(r.description, Validators.required),
            'startDate': new FormControl(r.startDate == null ? null : new Date(r.startDate)),
            'endDate': new FormControl(r.endDate == null ? null : new Date(r.endDate)),
            'position': new FormControl(r.position, Validators.required)
          });
        })
      );
  }

  save() {
    if (this.prizeForm.valid) {
      const prize: IPrizeUpdate = {
        name: this.prizeForm.value.name,
        description: this.prizeForm.value.description,
        startDate: formatDateOnly(this.prizeForm.value.startDate),
        endDate: formatDateOnly(this.prizeForm.value.endDate),
        position: this.prizeForm.value.position
      };

      const sub = (this.mode === 'add'
        ? this.adminApi.addPrize(this.tenantSlug, this.seasonId, prize)
        : this.adminApi.updatePrize(this.tenantSlug, this.seasonId, this.prizeId, prize)).subscribe(result => {
          this.result = true;
          this.bsModalRef.hide();
          sub.unsubscribe();
        });
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
