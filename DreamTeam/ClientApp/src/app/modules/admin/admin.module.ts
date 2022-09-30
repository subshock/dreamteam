import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AdminGuard } from './guards/admin.guard';
import { PaymentListComponent } from './payment/list/payment-list.component';
import { PaymentViewComponent } from './payment/view/payment-view.component';
import { PaymentContainerComponent } from './payment/payment-container.component';
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
    AdminDashboardComponent,
    PaymentListComponent,
    PaymentViewComponent,
    PaymentContainerComponent,
    TenantListComponent,
    TenantContainerComponent,
    TenantViewComponent
  ],
  providers: [],
})
export class AdminModule { }
