import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ITenantSeason, SeasonStateType } from 'src/app/types/public.types';

@Component({
  selector: 'app-tenant-data-view',
  templateUrl: './tenant-data-view.component.html',
  styleUrls: ['./tenant-data-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantDataViewComponent implements OnInit {

  SeasonStateType = SeasonStateType;

  @Input() tenant: ITenantSeason;

  constructor() { }

  ngOnInit(): void {
  }

}
