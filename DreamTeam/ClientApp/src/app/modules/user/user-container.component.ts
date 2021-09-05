import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
