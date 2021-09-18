import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AdminNavItemId } from '../admin.types';
import { AdminStateService } from '../services/admin-state.service';

@Component({
  template: `<router-outlet></router-outlet>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentContainerComponent implements OnInit, OnDestroy {

  constructor(private state: AdminStateService, ) { }

  ngOnInit(): void {
    this.state.addNavItem({ id: AdminNavItemId.Payments, name: 'Payments', route: ['/admin/payment'] });
  }

  ngOnDestroy(): void {
    this.state.removeNavItem(AdminNavItemId.Payments);
  }
}
