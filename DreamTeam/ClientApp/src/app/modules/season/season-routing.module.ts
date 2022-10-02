import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { SeasonDashboardComponent } from './dashboard/season-dashboard.component';
import { LeaderboardContainerComponent } from './leaderboard/leaderboard-container.component';
import { PlayerLeaderboardComponent } from './leaderboard/player-leaderboard.component';
import { TeamLeaderboardComponent } from './leaderboard/team-leaderboard.component';
import { TeamManageComponent } from './manage/team-manage.component';
import { SeasonPlayerViewComponent } from './player/season-player-view.component';
import { PrizesComponent } from './prizes/prizes.component';
import { TeamRegisterDoneComponent } from './register/team-register-done.component';
import { TeamRegisterComponent } from './register/team-register.component';
import { SeasonRulesComponent } from './rules/season-rules.component';
import { SeasonContainerComponent } from './season-container.component';
import { SeasonTeamViewComponent } from './team/season-team-view.component';

const routes: Routes = [
  {
    path: ':seasonid', component: SeasonContainerComponent, children: [
      { path: '', pathMatch: 'full', component: SeasonDashboardComponent },
      { path: 'register', pathMatch: 'full', component: TeamRegisterComponent, canActivate: [AuthorizeGuard] },
      { path: 'register/done', pathMatch: 'full', component: TeamRegisterDoneComponent, canActivate: [AuthorizeGuard] },
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
      { path: 'team/:id/manage', component: TeamManageComponent, canActivate: [AuthorizeGuard] },
      { path: 'prizes', component: PrizesComponent },
      { path: 'rules', component: SeasonRulesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeasonRoutingModule { }
