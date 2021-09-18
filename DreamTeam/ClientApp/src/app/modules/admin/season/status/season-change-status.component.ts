import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ISeasonView, SeasonStateType } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  templateUrl: './season-change-status.component.html',
  styleUrls: ['./season-change-status.component.less']
})
export class SeasonChangeStatusComponent implements OnInit {

  season: ISeasonView;

  result = false;

  changeForm: FormGroup = new FormGroup({
    'newState': new FormControl(null, Validators.required),
    'confirm': new FormControl(false, Validators.requiredTrue)
  });

  stateWorkflow = {
    [SeasonStateType.Setup]: [SeasonStateType.Registration, SeasonStateType.Finished],
    [SeasonStateType.Registration]: [SeasonStateType.Setup, SeasonStateType.Running],
    [SeasonStateType.Running]: [SeasonStateType.Finished],
    [SeasonStateType.Finished]: [SeasonStateType.Archived]
  };

  constructor(private adminApi: AdminApiService, private modalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  cancel() {
    this.result = false;
    this.modalRef.hide();
  }

  change() {
    if (this.changeForm.valid) {
      const sub = this.adminApi.changeSeasonStatus(this.season.id, this.changeForm.value.newState).subscribe(response => {
        if (response.result) {
          this.result = true;
          this.modalRef.hide();
        }
        sub.unsubscribe();
      });
    }
  }
}
