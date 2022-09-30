import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TenantContainerComponent } from './tenant-container.component';
import { TenantResolver } from './tenant.resolver';
import { TenantListComponent } from './list/tenant-list.component';
import { TenantViewComponent } from './view/tenant-view.component';
import { TenantDataViewComponent } from './shared/tenant-data-view/tenant-data-view.component';

@NgModule({
  declarations: [
    TenantContainerComponent,
    TenantListComponent,
    TenantViewComponent,
    TenantDataViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: TenantContainerComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: TenantListComponent
          },
          {
            path: ':slug',
            component: TenantContainerComponent,
            resolve: {
              'tenant': TenantResolver
            },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: TenantViewComponent
              },
              {
                path: 'admin',
                loadChildren: () => import('../tenant-admin/tenant-admin.module').then(m => m.TenantAdminModule)
              }
            ]
          }
        ]
      }
    ])
  ]
})
export class TenantModule { }
