import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-last-stand-container',
  template: `
    <p>
      last-stand-container works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LastStandContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
