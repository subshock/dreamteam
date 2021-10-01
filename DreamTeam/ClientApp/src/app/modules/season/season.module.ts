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


@NgModule({
  declarations: [
    TeamLeaderboardComponent,
    PlayerLeaderboardComponent,
    SeasonContainerComponent,
    SeasonHeaderComponent,
    RoundPaginationComponent,
    LeaderboardContainerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SeasonRoutingModule
  ]
})
export class SeasonModule { }
