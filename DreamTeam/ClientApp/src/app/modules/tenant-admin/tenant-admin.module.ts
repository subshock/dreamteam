import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TenantAdminGuard } from './tenant-admin.guard';
import { PlayerListComponent } from './player/list/player-list.component';
import { PrizeEditorComponent } from './prize/editor/prize-editor.component';
import { PrizeListComponent } from './prize/list/prize-list.component';
import { RoundCompleteComponent } from './round/complete/round-complete.component';
import { RoundEditorComponent } from './round/editor/round-editor.component';
import { RoundListComponent } from './round/list/round-list.component';
import { RoundViewComponent } from './round/view/round-view.component';
import { SeasonViewDetailsComponent } from './season/details/season-view-details.component';
import { SeasonEditorComponent } from './season/editor/season-editor.component';
import { SeasonListComponent } from './season/list/season-list.component';
import { SeasonChangeStatusComponent } from './season/status/season-change-status.component';
import { SeasonViewContainerComponent } from './season/view/season-view-container.component';
import { TeamListComponent } from './team/list/team-list.component';
import { TenantAdminContainerComponent } from './tenant-admin-container.component';
import { TradePeriodListComponent } from './tradeperiod/trade-period-list.component';
import { SeasonContentEditorComponent } from './season/content/season-content-editor.component';
import { NgxSummernoteModule } from 'ngx-summernote';


@NgModule({
  declarations: [
    SeasonListComponent,
    SeasonEditorComponent,
    SeasonViewContainerComponent,
    SeasonViewDetailsComponent,
    PlayerListComponent,
    TeamListComponent,
    RoundListComponent,
    RoundEditorComponent,
    RoundViewComponent,
    SeasonChangeStatusComponent,
    TradePeriodListComponent,
    RoundCompleteComponent,
    PrizeListComponent,
    PrizeEditorComponent,
    TenantAdminContainerComponent,
    SeasonContentEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    RouterModule.forChild([
      {
        path: '',
        component: TenantAdminContainerComponent,
        canActivate: [TenantAdminGuard],
        children: [
          { path: '', pathMatch: 'full', component: SeasonListComponent },
          {
            path: 'season/:id', component: SeasonViewContainerComponent, children: [
              { path: '', pathMatch: 'full', component: SeasonViewDetailsComponent },
              { path: 'players', component: PlayerListComponent },
              { path: 'teams', component: TeamListComponent },
              { path: 'rounds', component: RoundListComponent },
              { path: 'rounds/:id', component: RoundViewComponent },
              { path: 'trade-periods', component: TradePeriodListComponent },
              { path: 'prizes', component: PrizeListComponent }
            ]
          }
        ]
      }
    ]),
    SharedModule
  ]
})
export class TenantAdminModule { }
