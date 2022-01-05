import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { formatDateOnly } from 'src/app/shared/helpers';
import { DaterangeValidator } from 'src/app/shared/validators/daterange.validator';
import { DefaultDatepickerConfig, IPrize, IPrizeUpdate } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';

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
  seasonId: string;
  prizeId: string;
  result = false;

  prizeForm: FormGroup;
  dataSub$: Observable<any>;

  bsDatePickerOpts = DefaultDatepickerConfig;

  constructor(private adminApi: AdminApiService, private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.dataSub$ = (this.mode === 'add' ? of(this.defaultPrize) : this.adminApi.getPrize(this.seasonId, this.prizeId)).pipe(
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

      console.info(prize);

      const sub = (this.mode === 'add'
        ? this.adminApi.addPrize(this.seasonId, prize)
        : this.adminApi.updatePrize(this.seasonId, this.prizeId, prize)).subscribe(result => {
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
