import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  templateUrl: './team-manage.component.html',
  styleUrls: ['./team-manage.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamManageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
