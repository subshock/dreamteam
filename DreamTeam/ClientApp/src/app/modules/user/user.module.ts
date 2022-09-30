import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsListComponent } from './teams/list/teams-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { UserContainerComponent } from './user-container.component';



@NgModule({
  declarations: [
    TeamsListComponent,
    UserContainerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', canActivate: [AuthorizeGuard], component: UserContainerComponent, children: [
        { path: 'teams', pathMatch: 'full', component: TeamsListComponent },
      ] },
      { path: '', pathMatch: 'full', redirectTo: 'teams' },
    ])
  ]
})
export class UserModule { }
