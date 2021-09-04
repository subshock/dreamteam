import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { AdminComponent } from './admin.component';
import { SeasonListComponent } from './season/list/season-list.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AdminGuard } from './guards/admin.guard';
import { SeasonEditorComponent } from './season/editor/season-editor.component';
import { SeasonViewContainerComponent } from './season/view/season-view-container.component';
import { SeasonViewDetailsComponent } from './season/details/season-view-details.component';
import { PlayerListComponent } from './player/list/player-list.component';
import { TeamListComponent } from './team/list/team-list.component';
import { RoundListComponent } from './round/list/round-list.component';
import { RoundEditorComponent } from './round/editor/round-editor.component';
import { RoundViewComponent } from './round/view/round-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        canActivate: [AuthorizeGuard, AdminGuard],
        children: [
          { path: '', pathMatch: 'full', component: AdminDashboardComponent },
          { path: 'season', pathMatch: 'full', component: SeasonListComponent },
          {
            path: 'season/:id', component: SeasonViewContainerComponent, children: [
              { path: '', pathMatch: 'full', component: SeasonViewDetailsComponent },
              { path: 'players', component: PlayerListComponent },
              { path: 'teams', component: TeamListComponent },
              { path: 'rounds', component: RoundListComponent },
              { path: 'rounds/:id', component: RoundViewComponent }
            ]
          }
        ]
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    AdminComponent,
    SeasonListComponent,
    AdminDashboardComponent,
    SeasonEditorComponent,
    SeasonViewContainerComponent,
    SeasonViewDetailsComponent,
    PlayerListComponent,
    TeamListComponent,
    RoundListComponent,
    RoundEditorComponent,
    RoundViewComponent
  ],
  providers: [],
})
export class AdminModule { }
