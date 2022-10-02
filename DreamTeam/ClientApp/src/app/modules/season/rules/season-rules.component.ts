import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPublicSeasonInfo } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

interface IModel {
  season: IPublicSeasonInfo;
  rules: SafeHtml;
}

@Component({
  templateUrl: './season-rules.component.html',
  styleUrls: ['./season-rules.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonRulesComponent implements OnInit {

  model$: Observable<IModel>;

  constructor(private state: PublicSeasonStateService, private publicApi: PublicApiService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.model$ = this.state.season$.pipe(
      switchMap(s => this.publicApi.getSeasonContent(s.id, 'Rules').pipe(map(c => ({
        season: s,
        rules: this.sanitizer.bypassSecurityTrustHtml(c.content)
      }))))
    );
  }

}
