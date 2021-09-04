import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminNavItemId, IAdminNavItem } from './admin.types';
import { AdminStateService } from './services/admin-state.service';

@Component({
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminStateService]
})

export class AdminComponent implements OnInit, OnDestroy {
  navList$: Observable<IAdminNavItem[]>;
  AdminNavItemId = AdminNavItemId;

  constructor(private adminState: AdminStateService) { }

  ngOnInit() {
    this.navList$ = this.adminState.navList$;
    this.adminState.addNavItem({ id: AdminNavItemId.Admin, name: 'Admin', route: ['/', 'admin'] });
  }

  ngOnDestroy() {
    this.adminState.removeNavItem(AdminNavItemId.Admin);
  }
}
