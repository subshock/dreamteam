import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { finalize, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AdminNavItemId, IAppUser, ITenant, ITenantAdmin } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  templateUrl: './tenant-view.component.html',
  styleUrls: ['./tenant-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantViewComponent implements OnInit, OnDestroy {

  reloadSub = new BehaviorSubject<boolean>(true);
  adminReloadSub = new BehaviorSubject<boolean>(true);
  tenant$: Observable<ITenant>;
  admins$: Observable<ITenantAdmin[]>;
  users$: Observable<IAppUser[]>;
  mode: 'add' | 'update';
  editing = false;
  saving = false;
  tenantForm: FormGroup;
  adminForm: FormGroup;

  subscriptions: Subscription;

  constructor(private adminState: AdminStateService, private adminApi: AdminApiService, private route: ActivatedRoute,
    private router: Router, fb: FormBuilder) {
    this.tenantForm = fb.group({
      'name': ['', Validators.required],
      'slug': ['', Validators.required],
      'usePaymentGateway': ['', Validators.required],
      'enabled': [false, Validators.required]
    });
    this.adminForm = fb.group({
      'id': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscriptions = new Subscription();

    const tenantObs = {
      'add': of(<ITenant>{ id: '', name: '', slug: '', enabled: true }),
      'update': this.route.paramMap.pipe(
        switchMap(p => this.reloadSub.pipe(map(() => p))),
        switchMap(p => this.adminApi.getTenant(p.get('id'))),
        shareReplay(1)
      )
    };
    const adminObs = {
      'add': of(<ITenantAdmin[]>[]),
      'update': this.adminReloadSub.pipe(
        switchMap(() => tenantObs['update']),
        switchMap(t => this.adminApi.listTenantAdmins(t.slug)),
        shareReplay(1)
      )
    };

    this.tenant$ = this.route.data.pipe(
      switchMap(d => tenantObs[d.mode === 'add' ? 'add' : 'update'])
    );

    this.admins$ = this.route.data.pipe(
      switchMap(d => adminObs[d.mode === 'add' ? 'add' : 'update'])
    );

    const userObs = this.adminApi.listUsers().pipe(shareReplay(1));

    this.users$ = combineLatest([userObs, this.admins$]).pipe(
      map(([users, admins]) => ({ users: users, admins: admins.map(x => x.id) })),
      map(model => model.users.filter(x => !model.admins.includes(x.id)))
    );

    this.subscriptions.add(this.tenant$.pipe(take(1)).subscribe(tenant => {
      this.adminState.addNavItem({ id: AdminNavItemId.TenantView, name: tenant.name, bold: true, route: ['admin', 'tenant', tenant.id] });

      if (tenant.id === '') {
        this.editing = true;
        this.mode = 'add';
      } else {
        this.mode = 'update';
      }
    }));
  }

  ngOnDestroy(): void {
    this.adminState.removeNavItem(AdminNavItemId.TenantView);
    this.subscriptions.unsubscribe();
  }

  startUpdate(): void {
    this.subscriptions.add(this.tenant$.pipe(take(1)).subscribe(t => {
      this.tenantForm.setValue({ name: t.name, slug: t.slug, enabled: t.enabled, usePaymentGateway: t.usePaymentGateway });
      this.editing = true;
    }));
  }

  updateTenant(): void {
    if (!this.saving && this.tenantForm.valid) {
      this.saving = true;

      this.subscriptions.add(this.tenant$.pipe(
        take(1),
        finalize(() => this.saving = false),
        switchMap(t => this.mode === 'add'
          ? this.adminApi.addTenant(this.tenantForm.value) : this.adminApi.updateTenant(t.slug, this.tenantForm.value))
      ).subscribe(() => {
        if (this.mode === 'add') {
          this.router.navigate(['..'], { relativeTo: this.route });
        }
        this.reloadSub.next(true);
        this.editing = false;
      }));
    }
  }

  cancelUpdate(): void {
    if (!this.saving) {
      this.editing = false;
      if (this.mode === 'add') {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    }
  }

  reloadAdmins(): void {
    this.adminReloadSub.next(true);
  }

  addAdmin(): void {
    if (!this.saving && this.adminForm.valid) {
      this.saving = true;

      this.subscriptions.add(this.tenant$.pipe(
        take(1),
        finalize(() => this.saving = false),
        switchMap(t => this.adminApi.addTenantAdmin(t.slug, this.adminForm.value.id))
      ).subscribe(() => {
        this.adminReloadSub.next(true);
      }));
    }
  }

  removeAdmin(id: string): void {
    if (!this.saving) {
      this.saving = true;

      this.subscriptions.add(this.tenant$.pipe(
        take(1),
        finalize(() => this.saving = false),
        switchMap(t => this.adminApi.removeTenantAdmin(t.slug, id))
      ).subscribe(() => {
        this.adminReloadSub.next(true);
      }));
    }
  }
}
