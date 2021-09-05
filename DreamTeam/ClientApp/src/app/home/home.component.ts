import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { SeasonStateType } from '../modules/admin/admin.types';
import { PublicApiService } from '../services/public-api.service';
import { IPublicSeasonInfo } from '../types/public.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
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
