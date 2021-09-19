import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { SeasonStateType } from 'src/app/modules/admin/admin.types';
import { UserApiService } from 'src/app/services/user-api.service';
import { ITeam, ITeamAndTradePeriod } from 'src/app/types/public.types';

@Component({
  template: `
  <ng-container *ngIf="model$ | async as model">
    <form [formGroup]="teamForm" (ngSubmit)="save()">
      <div class="modal-header">
        <h4 class="modal-title">Update Team Details</h4>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="teamName">Team Name</label>
          <input type="text" class="form-control" id="teamName" formControlName="name">
        </div>
        <div class="form-group">
          <label for="teamOwner">Owner:</label>
          <input type="text" class="form-control" id="teamOwner" formControlName="owner">
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" [disabled]="!teamForm.valid" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
      </div>
    </form>
  </ng-container>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamEditorComponent implements OnInit {

  @Input() teamId: string;

  model$: Observable<ITeamAndTradePeriod>;
  result = false;

  teamForm: FormGroup;

  constructor(private modalRef: BsModalRef, private userApi: UserApiService) { }

  ngOnInit(): void {
    this.model$ = this.userApi.publicApi.getCurrentSeason().pipe(
      tap(s => {
        if (s.status !== SeasonStateType.Registration) {
          this.cancel();
        }
      }),
      filter(s => s.status === SeasonStateType.Registration),
      switchMap(() => this.userApi.getUserTeam(this.teamId)),
      tap(m => {
        this.teamForm = new FormGroup({
          'name': new FormControl(m.team.name, Validators.required),
          'owner': new FormControl(m.team.owner, Validators.required)
        });
      })
    );
  }

  save() {
    if (this.teamForm.valid) {
      const sub = this.userApi.updateTeam(this.teamId, this.teamForm.value).subscribe(() => {
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
