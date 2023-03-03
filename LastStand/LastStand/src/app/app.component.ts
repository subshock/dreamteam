import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, tap } from 'rxjs';
import { ICompetition } from './laststand.types';
import { LastStandStateService } from './services/laststand-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [LastStandStateService]
})
export class AppComponent {
  title = 'LastStand';

  competition$: Observable<ICompetition>;

  constructor(private state: LastStandStateService, private titleSvc: Title) {
    this.competition$ = state.competition$.pipe(
      tap(comp => {
        this.titleSvc.setTitle(comp.name);
      })
    );
  }
}
