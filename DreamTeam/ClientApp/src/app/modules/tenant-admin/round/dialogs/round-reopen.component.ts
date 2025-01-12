import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TenantAdminService } from '../../tenant-admin.service';

@Component({
  template: `
  <form [formGroup]="completeForm" (ngSubmit)="save()">
    <div class="modal-header">
      <h4 class="modal-title">Reopen Round</h4>
    </div>
    <div class="modal-body">
      <h5>Reopen round?</h5>
      <p>This will remove any calculated results or rankings for this round and reopen it for editing.  You will need to mark
        this round as complete to recalculate the results and rankings after making your changes.
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
export class RoundReopenComponent implements OnInit {

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
      const sub = this.adminApi.reopenRound(this.tenantSlug, this.seasonId, this.roundId).subscribe(() => {
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
