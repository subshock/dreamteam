import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AdminNavItemId } from '../admin.types';
import { AdminStateService } from '../services/admin-state.service';

@Component({
  template: `<router-outlet></router-outlet>`,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantContainerComponent implements OnInit, OnDestroy {

  constructor(private state: AdminStateService) { }

  ngOnInit(): void {
    this.state.addNavItem({ id: AdminNavItemId.Tenants, name: 'Tenants', route: ['/admin/tenant'] });
  }

  ngOnDestroy(): void {
    this.state.removeNavItem(AdminNavItemId.Tenants);
  }

}
