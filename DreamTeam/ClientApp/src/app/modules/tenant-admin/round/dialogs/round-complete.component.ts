import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TenantAdminService } from '../../tenant-admin.service';

@Component({
  template: `
  <form [formGroup]="completeForm" (ngSubmit)="save()">
    <div class="modal-header">
      <h4 class="modal-title">Complete Round</h4>
    </div>
    <div class="modal-body">
      <h5>Mark Round as Complete?</h5>
      <p>This will run statistics and rankings across all teams for this round.  You will not be able to add or update any
        player statistics after this.
      </p>
      <p>
        Round statistics and rankings will be run automatically in the background after the round is marked as complete. It may
        take several minutes to complete fully.
      </p>
      <div class="alert alert-info">
        <div class="checkbox">
          <label>
            <input type="checkbox" formControlName="confirm">
            Yes, I want to do this.
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="submit" class="btn btn-primary" [disabled]="!completeForm.valid || result">Save</button>
      <button type="button" class="btn btn-secondary" [disabled]="result" (click)="cancel()">Cancel</button>
    </div>
  </form>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundCompleteComponent implements OnInit {

  @Input() tenantSlug: string;
  @Input() seasonId: string;
  @Input() roundId: string;

  result = false;

  completeForm = new FormGroup({
    'confirm': new FormControl(false, Validators.requiredTrue)
  });

  constructor(private adminApi: TenantAdminService, private modalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  save() {
    if (this.completeForm.valid) {
      const sub = this.adminApi.completeRound(this.tenantSlug, this.seasonId, this.roundId).subscribe(() => {
        sub.unsubscribe();
        this.result = true;
        this.modalRef.hide();
      });
    }
  }

  cancel() {
    this.result = false;
    this.modalRef.hide();
  }
}
