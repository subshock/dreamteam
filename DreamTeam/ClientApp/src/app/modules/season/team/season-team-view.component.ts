import { Component, OnInit, ChangeDetectionStrategy, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { ITeamReport, ITeamReportRound, TeamPlayerType } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

interface IModel extends ITeamReport {
  total: ITeamReportRound;
}

@Component({
  templateUrl: './season-team-view.component.html',
  styleUrls: ['./season-team-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonTeamViewComponent implements OnInit {

  private chartParamSub = new BehaviorSubject({ type: 'cumulative' });

  TeamPlayerType = TeamPlayerType;

  model$: Observable<IModel>;
  chart$: Observable<EChartsOption>;
  chartParam$: Observable<{ type: string; }> = this.chartParamSub.asObservable();
  loadingChart = true;

  constructor(private state: PublicSeasonStateService, private publicApi: PublicApiService, private route: ActivatedRoute,
    @Inject(LOCALE_ID) private localeId: string) { }

  ngOnInit(): void {
    this.model$ = combineLatest([this.state.season$, this.route.paramMap]).pipe(
      switchMap(([s, p]) => this.publicApi.getTeamReport(s.id, p.get('id'))),
      map(r => ({ ...r, total: this.calculateTotal(r.rounds) }))
    );

    this.chart$ = combineLatest([this.chartParamSub, this.model$]).pipe(
      map(([p, m]) => this.createChartOptions(p, m))
    );
  }

  private calculateTotal(rounds: ITeamReportRound[]): ITeamReportRound {
    return rounds.reduce((prev, curr) => {
      prev.runs += curr.runs;
      prev.unassistedWickets += curr.unassistedWickets;
      prev.assistedWickets += curr.assistedWickets;
      prev.catches += curr.catches;
      prev.runouts += curr.runouts;
      prev.stumpings += curr.stumpings;
      prev.points += curr.points;
      prev.roundRank = curr.roundRank;
      prev.seasonRank = curr.seasonRank;
      return prev;
    }, {
      round: null, runs: 0, unassistedWickets: 0, assistedWickets: 0, catches: 0,
      runouts: 0, stumpings: 0, points: 0, roundRank: 0, seasonRank: 0
    });
  }

  private createChartOptions(params: any, model: IModel): EChartsOption {
    return {};
  }
}
