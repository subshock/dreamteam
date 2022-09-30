import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthorizeService, IUser, userHasClaim } from 'src/api-authorization/authorize.service';
import { PublicApiService } from 'src/app/services/public-api.service';
import { ITenantSeason } from 'src/app/types/public.types';

@Component({
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantListComponent implements OnInit {

  model$: Observable<ITenantSeason[]>;

  constructor(private publicApi: PublicApiService, private authService: AuthorizeService) { }

  ngOnInit(): void {
    this.model$ = combineLatest([this.publicApi.getTenants(), this.authService.getUser()]).pipe(
      map(([tenants, user]) => tenants.map(t => ({ ...t, isAdmin: userHasClaim(user, 'tenant', t.slug) })))
    );
  }
}
