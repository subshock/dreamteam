import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPTY, from, Observable } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { SeasonStateType } from '../modules/admin/admin.types';
import { DynamicScriptLoaderService } from '../services/dynamic-script-loader.service';
import { PublicApiService } from '../services/public-api.service';
import { UserApiService } from '../services/user-api.service';
import { IPublicSeasonInfo } from '../types/public.types';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  season$: Observable<IPublicSeasonInfo>;
  SeasonStateType = SeasonStateType;
  isAuthenticated$: Observable<boolean>;

  constructor(private publicApi: PublicApiService, private authService: AuthorizeService) { }

  ngOnInit(): void {
    this.season$ = this.publicApi.getCurrentSeason();
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }
}
