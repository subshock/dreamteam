import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AdminStateService } from '../services/admin-state.service';
import { AdminNavItemId } from '../admin.types';

@Component({
  selector: 'app-last-stand-container',
  template: `<router-outlet></router-outlet>`,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LastStandContainerComponent implements OnInit {

  constructor(private state: AdminStateService,) { }

  ngOnInit(): void {
    console.info('laststand init');
    this.state.addNavItem({ id: AdminNavItemId.LastStand, name: 'Last Stand', route: ['/admin/laststand'] });
  }

  ngOnDestroy(): void {
    console.info('laststand destroy');
    this.state.removeNavItem(AdminNavItemId.LastStand);
  }

}
