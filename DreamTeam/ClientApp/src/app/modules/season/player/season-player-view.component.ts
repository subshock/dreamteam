import { formatNumber } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPlayerReport, IPlayerReportRound, IPlayerReportRoundSummary } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

interface IModel extends IPlayerReport {
  total: IPlayerReportRound;
}

@Component({
  templateUrl: './season-player-view.component.html',
  styleUrls: ['./season-player-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonPlayerViewComponent implements OnInit {

  private chartParamSub = new BehaviorSubject({ type: 'cumulative' });

  model$: Observable<IModel>;
  chart$: Observable<EChartsOption>;
  chartParam$: Observable<{ type: string; }> = this.chartParamSub.asObservable();
  loadingChart = true;

  constructor(private state: PublicSeasonStateService, private publicApi: PublicApiService, private route: ActivatedRoute,
    @Inject(LOCALE_ID) private localeId: string) { }

  ngOnInit(): void {
    this.model$ = combineLatest([this.state.season$, this.route.paramMap]).pipe(
      switchMap(([s, p]) => this.publicApi.getPlayerReport(s.id, p.get('id'))),
      map(r => ({ ...r, total: this.calculateTotal(r.rounds) })),
      shareReplay(1)
    );

    this.chart$ = combineLatest([this.chartParamSub, this.model$]).pipe(
      map(([p, m]) => this.createChartOptions(p, m))
    );
  }

  private calculateTotal(rounds: IPlayerReportRound[]): IPlayerReportRound {
    return rounds.reduce((prev, curr) => {
      prev.runs += curr.runs;
      prev.unassistedWickets += curr.unassistedWickets;
      prev.assistedWickets += curr.assistedWickets;
      prev.catches += curr.catches;
      prev.runouts += curr.runouts;
      prev.stumpings += curr.stumpings;
      prev.points += curr.points;
      return prev;
    }, { round: null, runs: 0, unassistedWickets: 0, assistedWickets: 0, catches: 0, runouts: 0, stumpings: 0, points: 0 });
  }

  private createChartOptions(params: { type: string; }, model: IModel): EChartsOption {
    // Get rounds for X axis from the average benchmark since we know it'll always have all of them
    const rounds = model.benchmarks.find(x => x.type === -1).rounds.map(x => x.round);
    const fnGetRoundPoints = (rarray: IPlayerReportRoundSummary[], roundName: number) => {
      const obj = rarray.find(x => x.round === roundName);
      return obj == null ? null : obj.points;
    };

    const series = [
      { name: model.player.name, type: 0, rounds: model.rounds.map(x => ({ round: x.round, points: x.points })) },
      ...model.benchmarks
    ].map(x => ({ name: x.name, type: x.type, data: rounds.map(r => fnGetRoundPoints(x.rounds, r)) }));

    const ret: EChartsOption = {
      grid: [
        { left: '5%', top: '50', right: '5%', bottom: '50' }
      ],
      xAxis: {
        type: 'category',
        gridIndex: 0,
        name: 'Rounds',
        data: rounds.map(x => String(x)),
        nameLocation: 'middle',
        nameTextStyle: {
          padding: [10, 0, 0, 0]
        }
      },
      yAxis: {
        type: 'value',
        gridIndex: 0,
        name: 'Points'
      },
      legend: {
        show: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: (p) => this.formatTooltip(p)
      },
      series: series.map(s => ({
        type: 'line',
        name: s.name,
        symbol: s.type === 0 ? 'emptyCircle' : 'circle',
        symbolSize: s.type === 0 ? 16 : 6,
        smooth: false,
        smoothMonotone: 'x',
        lineStyle: {
          type: s.type === -1 ? 'dotted' : 'solid',
          width: s.type === 0 ? 4 : s.type < 0 ? 3 : 2
        },
        data: params.type === 'cumulative'
          ? s.data.reduce((prev, curr) => [...prev, curr + (prev.length > 0 ? prev[prev.length - 1] : 0)], [])
          : s.data
      }))
    };

    this.loadingChart = false;
    return ret;
  }

  toggleChartType(params: { type: string }) {
    const newParams = { ...params, type: params.type === 'cumulative' ? 'normal' : 'cumulative' };
    this.chartParamSub.next(newParams);
  }

  formatTooltip(params: any) {
    const didNotPlay = '<small class="text-muted">Did Not Play</small>';
    const cumulative = this.chartParamSub.value.type === 'cumulative';
    let html = `<table><thead><tr><th colspan="2">${cumulative ? 'Total up to Round' : 'Round'} ${params[0].axisValueLabel}` +
      `</th><th></th></tr></thead><tbody>`;

    for (const series of params) {
      html += `<tr><td>${series.marker}</td><td>${series.seriesName}</td>` +
        `<td class="tt-value-col text-right font-weight-bold">` +
        `${series.value !== undefined ? formatNumber(series.value, this.localeId) : didNotPlay}</td></tr>`;
    }

    html += '</tbody></table>';
    return html;
  }
}
