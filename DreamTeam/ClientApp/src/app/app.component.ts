import { Component } from '@angular/core';
import { PopoverConfig } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  constructor(popoverConfig: PopoverConfig) {
    popoverConfig.placement = 'left';
    popoverConfig.triggers = 'mouseenter:mouseleave';
  }
}
