import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import { SeasonStateType } from 'src/app/modules/admin/admin.types';
import { UserApiService } from 'src/app/services/user-api.service';
import { SquarePayComponent } from 'src/app/shared/components/square-pay/square-pay.component';
import { IPublicSeasonInfo } from 'src/app/types/public.types';

@Component({
  templateUrl: './team-register.component.html',
  styleUrls: ['./team-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamRegisterComponent implements OnInit, OnDestroy {

  SeasonStateType = SeasonStateType;
  season$: Observable<IPublicSeasonInfo>;
  registerForm: FormGroup;
  user: IUser;

  private saveSub = new BehaviorSubject<boolean>(false);
  save$ = this.saveSub.asObservable().pipe(map(x => ({ saving: x })));

  @ViewChild('payment') payment: SquarePayComponent;

  private subscriptions: Subscription;

  get teams() {
    return this.registerForm.get('teams') as FormArray;
  }

  constructor(private userApi: UserApiService, private authService: AuthorizeService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();

    const obs = combineLatest([this.userApi.publicApi.getCurrentSeason(), this.authService.getUser()]).pipe(
      tap(([s, u]) => {
        this.user = u;

        this.createForm();
      }),
      shareReplay(1)
    );

    this.season$ = obs.pipe(map(([s]) => s));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private createForm() {
    this.registerForm = new FormGroup({
      'teams': new FormArray([this.createTeamRegisterGroup()])
    });
  }

  private createTeamRegisterGroup(): FormGroup {
    return new FormGroup({
      'name': new FormControl('', Validators.required),
      'owner': new FormControl(this.user.name, Validators.required),
    });
  }

  addTeam() {
    this.teams.push(this.createTeamRegisterGroup());
  }

  removeTeam(i) {
    this.teams.removeAt(i);
  }

  async save(season: IPublicSeasonInfo) {
    if (this.registerForm.valid) {
      this.saveSub.next(true);
      const paymentResult = await this.payment.createPayment();

      if (paymentResult.status === 'OK') {
        this.subscriptions.add(this.userApi.registerTeams(season.id, this.teams.value, paymentResult.token)
          .pipe(finalize(() => this.saveSub.next(false)))
          .subscribe(result => {
            if (result.success) {
              this.router.navigate(['..'], { relativeTo: this.route });
            } else {
              // TODO: handle errors
            }
          }));
      } else {
        this.saveSub.next(false);
      }
    }
  }

  handlePaymentErrors(errors: any) {
    // TODO: handle errors
    console.info('errors', errors);
  }
}
