import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LastStandStateService } from '../../services/laststand-state.service';
import { ICompetition } from '../../laststand.admin.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-last-stand-view',
  templateUrl: './last-stand-view.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LastStandStateService]
})
export class LastStandViewComponent implements OnInit {

  competition$: Observable<ICompetition>;

  constructor(private route: ActivatedRoute, private state: LastStandStateService) {
    this.competition$ = this.state.competition$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      this.state.setCompetitionId(map.get('id'));
    });
  }
}
