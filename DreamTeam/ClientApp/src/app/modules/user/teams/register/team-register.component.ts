import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import { SeasonStateType } from 'src/app/modules/admin/admin.types';
import { PublicApiService } from 'src/app/services/public-api.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { IPublicSeasonInfo } from 'src/app/types/public.types';

@Component({
  templateUrl: './team-register.component.html',
  styleUrls: ['./team-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamRegisterComponent implements OnInit {

  SeasonStateType = SeasonStateType;
  season$: Observable<IPublicSeasonInfo>;
  registerForm: FormGroup;
  user: IUser;

  get teams() {
    return this.registerForm.get('teams') as FormArray;
  }

  constructor(private userApi: UserApiService, private authService: AuthorizeService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const obs = combineLatest([this.userApi.publicApi.getCurrentSeason(), this.authService.getUser()]).pipe(
      tap(([s, u]) => {
        this.user = u;

        this.createForm();
      }),
      shareReplay(1)
    );

    this.season$ = obs.pipe(map(([s]) => s));
  }

  private createForm() {
    this.registerForm = new FormGroup({
      'teams': new FormArray([this.createTeamRegisterGroup()])
    });
  }

  private createTeamRegisterGroup(): FormGroup {
    return new FormGroup({
      'name': new FormControl('', Validators.required),
      'owner': new FormControl(this.user.name, Validators.required)
    });
  }

  addTeam() {
    this.teams.push(this.createTeamRegisterGroup());
  }

  removeTeam(i) {
    this.teams.removeAt(i);
  }

  save(season: IPublicSeasonInfo) {
    if (this.registerForm.valid) {
      const sub = this.userApi.registerTeams(season.id, this.teams.value).subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
        sub.unsubscribe();
      });
    }
    // console.info('save', season, this.registerForm.valid, this.registerForm.value, this.teams);
  }
}
