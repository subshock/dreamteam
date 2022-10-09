import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { TenantAdminService } from '../../tenant-admin.service';

@Component({
  templateUrl: './player-import-dialog.component.html',
  styleUrls: ['./player-import-dialog.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerImportDialogComponent implements OnInit, OnDestroy {

  tenantSlug: string;
  seasonId: string;
  result: boolean;

  form: FormGroup;

  view$ = new BehaviorSubject<string>('form');
  messages$ = new ReplaySubject<string[]>(1);
  error = false;

  private subscriptions: Subscription;

  constructor(private adminApi: TenantAdminService, private bsModalRef: BsModalRef, fb: FormBuilder) {
    this.form = fb.group({
      file: ['', Validators.required],
      hasHeaders: [false],
      overwrite: [false],
      fileSource: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscriptions = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  back(): void {
    this.form.reset();
    this.view$.next('form');
  }

  cancel(): void {
    this.result = false;
    this.bsModalRef.hide();
  }

  done(): void {
    this.result = true;
    this.bsModalRef.hide();
  }

  onFileChanged(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({ fileSource: file });
    }
  }

  import(): void {
    if (this.form.valid) {
      this.view$.next('importing');
      this.subscriptions.add(this.adminApi.importPlayers(this.tenantSlug, this.seasonId,
        this.form.get('fileSource').value, this.form.value.hasHeaders, this.form.value.overwrite).pipe(
          map(m => ({ success: true, messages: m })),
          catchError((response: HttpErrorResponse) => {
            return of({ success: false, messages: <string[]>response.error });
          })
        ).subscribe(result => {
          this.messages$.next(result.messages);
          this.view$.next(result.success ? 'done' : 'error');
        }));
    }
  }
}
