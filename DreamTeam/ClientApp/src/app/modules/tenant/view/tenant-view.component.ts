import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthorizeService, userHasClaim } from 'src/api-authorization/authorize.service';
import { PublicApiService } from 'src/app/services/public-api.service';
import { ITenantSeason } from 'src/app/types/public.types';

@Component({
  templateUrl: './tenant-view.component.html',
  styleUrls: ['./tenant-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantViewComponent implements OnInit {

  tenant$: Observable<ITenantSeason>;

  constructor(private publicApi: PublicApiService, private route: ActivatedRoute, private authService: AuthorizeService) { }

  ngOnInit(): void {
    this.tenant$ = combineLatest([this.publicApi.getTenantSeasons(this.route.snapshot.data.tenant.slug), this.authService.getUser()]).pipe(
      map(([tenant, user]) => ({ ...tenant, isAdmin: userHasClaim(user, 'tenant', tenant.slug) }))
    );
  }

}
