import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TenantStateService } from './tenant-state.service';

@Component({
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TenantStateService]
})
export class TenantContainerComponent implements OnInit {

  constructor(private route: ActivatedRoute, private state: TenantStateService) { }

  ngOnInit(): void {
    this.state.setTenant(this.route.snapshot.data.tenant);
  }

}
