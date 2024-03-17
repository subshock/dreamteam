import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';
import { ICompetition } from '../../laststand.admin.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-last-stand-list',
  templateUrl: './last-stand-list.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LastStandListComponent implements OnInit {

  competitions$: Observable<ICompetition[]>;

  constructor(private adminSvc: AdminApiService) { }

  ngOnInit(): void {
    this.competitions$ = this.adminSvc.getLastStandCompetitions();
  }

}
