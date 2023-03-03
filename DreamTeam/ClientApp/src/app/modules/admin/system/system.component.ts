import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiService } from '../services/admin-api.service';

@Component({
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemComponent implements OnInit {

  cors$: Observable<any>;

  constructor(private apiSvc: AdminApiService) { }

  ngOnInit(): void {
    this.cors$ = this.apiSvc.getCors();
  }
}
