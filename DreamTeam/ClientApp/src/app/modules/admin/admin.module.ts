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
import { SeasonChangeStatusComponent } from './season/status/season-change-status.component';
import { TradePeriodListComponent } from './tradeperiod/trade-period-list.component';
import { RoundCompleteComponent } from './round/complete/round-complete.component';
import { PaymentListComponent } from './payment/list/payment-list.component';
import { PaymentViewComponent } from './payment/view/payment-view.component';
import { PaymentContainerComponent } from './payment/payment-container.component';
import { PrizeListComponent } from './prize/list/prize-list.component';
import { PrizeEditorComponent } from './prize/editor/prize-editor.component';
import { TenantListComponent } from './tenant/list/tenant-list.component';
import { TenantContainerComponent } from './tenant/tenant-container.component';
import { TenantViewComponent } from './tenant/view/tenant-view.component';

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
          {
            path: 'tenant', component: TenantContainerComponent, children: [
              { path: '', pathMatch: 'full', component: TenantListComponent },
              { path: 'add', pathMatch: 'full', component: TenantViewComponent, data: { 'mode': 'add' } },
              { path: ':id', component: TenantViewComponent, data: { mode: 'update' } }
            ]
          },
          { path: 'season', pathMatch: 'full', component: SeasonListComponent },
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
          },
          {
            path: 'payment', component: PaymentContainerComponent, children: [
              { path: '', pathMatch: 'full', component: PaymentListComponent },
              { path: ':id', component: PaymentViewComponent }
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
    RoundViewComponent,
    SeasonChangeStatusComponent,
    TradePeriodListComponent,
    RoundCompleteComponent,
    PaymentListComponent,
    PaymentViewComponent,
    PaymentContainerComponent,
    PrizeListComponent,
    PrizeEditorComponent,
    TenantListComponent,
    TenantContainerComponent,
    TenantViewComponent
  ],
  providers: [],
})
export class AdminModule { }
