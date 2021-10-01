import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardContainerComponent } from './leaderboard/leaderboard-container.component';
import { PlayerLeaderboardComponent } from './leaderboard/player-leaderboard.component';
import { TeamLeaderboardComponent } from './leaderboard/team-leaderboard.component';
import { SeasonContainerComponent } from './season-container.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeasonRoutingModule { }
