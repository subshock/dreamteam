import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardContainerComponent } from './leaderboard/leaderboard-container.component';
import { PlayerLeaderboardComponent } from './leaderboard/player-leaderboard.component';
import { TeamLeaderboardComponent } from './leaderboard/team-leaderboard.component';
import { SeasonPlayerViewComponent } from './player/season-player-view.component';
import { PrizesComponent } from './prizes/prizes.component';
import { SeasonContainerComponent } from './season-container.component';
import { SeasonTeamViewComponent } from './team/season-team-view.component';

const routes: Routes = [
  {
    path: ':id', component: SeasonContainerComponent, children: [
      {
        path: 'teams', component: LeaderboardContainerComponent,
        data: { type: 'teams', title: 'Teams' }, children: [
          { path: '', component: TeamLeaderboardComponent, pathMatch: 'full' },
          { path: ':id', component: TeamLeaderboardComponent }
        ]
      },
      {
        path: 'players', component: LeaderboardContainerComponent,
        data: { type: 'players', title: 'Players' }, children: [
          { path: '', component: PlayerLeaderboardComponent, pathMatch: 'full' },
          { path: ':id', component: PlayerLeaderboardComponent }
        ]
      },
      { path: 'player/:id', component: SeasonPlayerViewComponent },
      { path: 'team/:id', component: SeasonTeamViewComponent },
      { path: 'prizes', component: PrizesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeasonRoutingModule { }
