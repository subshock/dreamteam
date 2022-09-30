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
import { PrizesComponent } from './prizes/prizes.component';
import { SeasonDashboardComponent } from './dashboard/season-dashboard.component';
import { PrizeDataViewComponent } from './components/prize-data-view/prize-data-view.component';
import { TeamRegisterComponent } from './register/team-register.component';
import { TeamRegisterDoneComponent } from './register/team-register-done.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamManageComponent } from './manage/team-manage.component';

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
    SeasonTeamViewComponent,
    PrizesComponent,
    SeasonDashboardComponent,
    PrizeDataViewComponent,
    TeamRegisterComponent,
    TeamRegisterDoneComponent,
    TeamManageComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({ echarts }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SeasonRoutingModule
  ]
})
export class SeasonModule { }
