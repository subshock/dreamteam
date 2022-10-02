import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { PublicApiService } from '../services/public-api.service';
import { ITenantSeason } from '../types/public.types';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  isAuthenticated$: Observable<{ success: boolean; }>;
  tenants$: Observable<ITenantSeason[]>;

  readonly leaderboardLimit = 5;

  constructor(private publicApi: PublicApiService, private authService: AuthorizeService) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated().pipe(map(x => ({ success: x })));
    this.tenants$ = this.publicApi.getTenants();
  }
}
