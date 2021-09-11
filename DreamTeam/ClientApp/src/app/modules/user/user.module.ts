import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsListComponent } from './teams/list/teams-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TeamRegisterComponent } from './teams/register/team-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { UserContainerComponent } from './user-container.component';
import { TeamManageComponent } from './teams/manage/team-manage.component';
import { TeamEditorComponent } from './teams/editor/team-editor.component';



@NgModule({
  declarations: [
    TeamsListComponent,
    TeamRegisterComponent,
    UserContainerComponent,
    TeamManageComponent,
    TeamEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', canActivate: [AuthorizeGuard], component: UserContainerComponent, children: [
        { path: 'teams', pathMatch: 'full', component: TeamsListComponent },
        { path: 'teams/register', component: TeamRegisterComponent },
        { path: 'teams/:id/manage', component: TeamManageComponent }
      ] },
      { path: '', pathMatch: 'full', redirectTo: 'teams' },
    ])
  ]
})
export class UserModule { }
