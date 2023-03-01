import { ChangeDetectionStrategy, Component } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LastStandStateService } from '../services/laststand-state.service';
import { LastStandService } from '../services/laststand.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  competition$!: Observable<any>;

  constructor(private state: LastStandStateService) {}

  ngOnInit(): void {
    this.competition$ = this.state.competition$;
  }
}
