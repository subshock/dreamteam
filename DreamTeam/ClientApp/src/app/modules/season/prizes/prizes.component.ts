import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { IPublicSeasonInfo } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

@Component({
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrizesComponent implements OnInit {

  season$: Observable<IPublicSeasonInfo>;

  constructor(private state: PublicSeasonStateService) { }

  ngOnInit(): void {
    this.season$ = this.state.season$;
  }

}
