import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IPublicSeasonInfo } from 'src/app/types/public.types';

@Component({
  selector: 'app-season-header',
  templateUrl: './season-header.component.html',
  styleUrls: ['./season-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonHeaderComponent implements OnInit {

  @Input() season: IPublicSeasonInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
