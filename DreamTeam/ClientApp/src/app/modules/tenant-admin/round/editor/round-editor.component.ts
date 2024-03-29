import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { formatDateOnly } from 'src/app/shared/helpers';
import { DaterangeValidator } from 'src/app/shared/validators/daterange.validator';
import { TenantAdminService } from '../../tenant-admin.service';
import { IRoundUpdate } from '../../tenant-admin.types';

@Component({
  templateUrl: './round-editor.component.html',
  styleUrls: ['./round-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundEditorComponent implements OnInit {

  mode: 'add' | 'update';
  tenantSlug: string;
  seasonId: string;
  roundId: string;
  result: { id: string } | false = false;

  roundForm: FormGroup;
  dataSub$: Observable<any>;

  private defaultRound: IRoundUpdate = {
    name: null,
    startDate: null,
    endDate: null
  };

  bsDatepickerOpts?: Partial<BsDaterangepickerConfig> = {
    showWeekNumbers: false,
    containerClass: 'theme-dark-blue',
    rangeInputFormat: 'ddd D MMM YYYY',
    rangeSeparator: ' - '
  };

  constructor(private adminApi: TenantAdminService, private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.dataSub$ = (this.mode === 'add' ? of(this.defaultRound) : this.adminApi.getRound(this.tenantSlug, this.seasonId, this.roundId))
      .pipe(
        tap(r => {
          this.roundForm = new FormGroup({
            'name': new FormControl(r.name, Validators.required),
            'dateRange': new FormControl(r.startDate == null ? null : [new Date(r.startDate),
            new Date(r.endDate)], DaterangeValidator(true)),
          });
        })
      );
  }

  save() {
    if (this.roundForm.valid) {
      const round: IRoundUpdate = {
        name: this.roundForm.value.name,
        startDate: formatDateOnly(this.roundForm.value.dateRange[0]),
        endDate: formatDateOnly(this.roundForm.value.dateRange[1])
      };

      const sub = (this.mode === 'add'
        ? this.adminApi.addRound(this.tenantSlug, this.seasonId, round)
        : this.adminApi.updateRound(this.tenantSlug, this.seasonId, this.roundId, round)).subscribe(result => {
          this.result = result || true;
          this.bsModalRef.hide();
          sub.unsubscribe();
        });
    }
  }

  cancel() {
    this.result = false;
    this.bsModalRef.hide();
  }
}
