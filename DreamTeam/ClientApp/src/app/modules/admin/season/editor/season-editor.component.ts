import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminApiService } from '../../services/admin-api.service';
import { ISeasonUpdate } from '../../admin.types';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: './season-editor.component.html',
  styleUrls: ['./season-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonEditorComponent implements OnInit {

  mode: 'add' | 'update';
  seasonId: string;

  private defaultSeason: ISeasonUpdate = {
    name: '',
    cost: 20.00,
    budget: 80,
    pointDefinition: {
      runs: 1,
      unassistedWickets: 15,
      assistedWickets: 12,
      catches: 10,
      runouts: 10,
      stumpings: 10
    }
  };

  model$: Observable<ISeasonUpdate>;

  result: { id: string; } | false = false;

  seasonForm: FormGroup;

  constructor(private adminApi: AdminApiService, private modalRef: BsModalRef) { }

  ngOnInit(): void {
    this.model$ = (this.mode === 'update'
      ? this.adminApi.getSeason(this.seasonId)
      : of({ ...this.defaultSeason, pointDefinition: { ...this.defaultSeason.pointDefinition } })).pipe(
        tap(season => {
          this.seasonForm = new FormGroup({
            name: new FormControl(season.name, Validators.required),
            cost: new FormControl(season.cost, Validators.required),
            budget: new FormControl(season.budget, Validators.required),
            pointDefinition: new FormGroup({
              runs: new FormControl(season.pointDefinition?.runs, Validators.required),
              unassistedWickets: new FormControl(season.pointDefinition?.unassistedWickets, Validators.required),
              assistedWickets: new FormControl(season.pointDefinition?.assistedWickets, Validators.required),
              catches: new FormControl(season.pointDefinition?.catches, Validators.required),
              runouts: new FormControl(season.pointDefinition?.runouts, Validators.required),
              stumpings: new FormControl(season.pointDefinition?.stumpings, Validators.required)
            })
          });
        })
      );
  }

  cancel() {
    this.result = false;
    this.modalRef.hide();
  }

  save() {
    if (this.seasonForm.valid) {
      const season: ISeasonUpdate = <ISeasonUpdate>this.seasonForm.value;

      const obs = this.mode === 'add' ? this.adminApi.addSeason(season) : this.adminApi.updateSeason(this.seasonId, season);

      const sub = obs.subscribe(result => {
        sub.unsubscribe();
        if (this.mode === 'add') {
          this.result = { id: result.id };
        } else {
          this.result = { id: this.seasonId };
        }

        this.modalRef.hide();
      });
    }
  }
}
