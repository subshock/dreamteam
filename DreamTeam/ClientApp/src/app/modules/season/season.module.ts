import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SeasonRoutingModule } from './season-routing.module';
import { TeamLeaderboardComponent } from './leaderboard/team-leaderboard.component';
import { PlayerLeaderboardComponent } from './leaderboard/player-leaderboard.component';
import { SeasonContainerComponent } from './season-container.component';
import { SeasonHeaderComponent } from './header/season-header.component';
import { CommonModule } from '@angular/common';
import { RoundPaginationComponent } from './round-pagination/round-pagination.component';
import { LeaderboardContainerComponent } from './leaderboard/leaderboard-container.component';
import { SeasonPlayerViewComponent } from './player/season-player-view.component';
import { NgxEchartsModule } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import {
  LineChart
} from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { SeasonTeamViewComponent } from './team/season-team-view.component';

echarts.use(
  [TooltipComponent, LegendComponent, LineChart, CanvasRenderer, GridComponent]
);

@NgModule({
  declarations: [
    TeamLeaderboardComponent,
    PlayerLeaderboardComponent,
    SeasonContainerComponent,
    SeasonHeaderComponent,
    RoundPaginationComponent,
    LeaderboardContainerComponent,
    SeasonPlayerViewComponent,
    SeasonTeamViewComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({ echarts }),
    CommonModule,
    SharedModule,
    SeasonRoutingModule
  ]
})
export class SeasonModule { }
