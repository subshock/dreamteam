import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import { PublicApiService } from 'src/app/services/public-api.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { SquarePayComponent } from 'src/app/shared/components/square-pay/square-pay.component';
import { IPublicSeasonInfo, IPublicTenant, ITeamRegisterResult, SeasonStateType } from 'src/app/types/public.types';
import { PublicSeasonStateService } from '../public-season-state.service';

interface IModel {
  season: IPublicSeasonInfo;
  tenant: IPublicTenant;
  user: IUser;
}

@Component({
  templateUrl: './team-register.component.html',
  styleUrls: ['./team-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamRegisterComponent implements OnInit, OnDestroy {

  SeasonStateType = SeasonStateType;
  model$: Observable<IModel>;
  registerForm: FormGroup;
  user: IUser;

  private saveSub = new BehaviorSubject<boolean>(false);
  save$ = this.saveSub.asObservable().pipe(map(x => ({ saving: x })));

  private errorSub = new Subject<any>();
  error$: Observable<string[]>;

  @ViewChild('payment') payment: SquarePayComponent;

  private subscriptions: Subscription;

  get teams() {
    return this.registerForm.get('teams') as FormArray;
  }

  constructor(private state: PublicSeasonStateService, private userApi: UserApiService, private authService: AuthorizeService,
    private route: ActivatedRoute, private router: Router, private publicApi: PublicApiService) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();
    this.error$ = this.errorSub.pipe(map(x => this.convertErrorsToArray(x)));

    this.model$ = combineLatest([this.state.season$, this.authService.getUser()]).pipe(
      map(x => ({ season: x[0], user: x[1] })),
      switchMap(m => this.publicApi.getTenant(m.season.slug).pipe(map(t => ({...m, tenant: t})))),
      tap(m => {
        if (m.season.status !== SeasonStateType.Registration || !m.season.tradePeriod) {
          this.router.navigate(['..'], { relativeTo: this.route });
        }
      }),
      shareReplay(1)
    );

    this.subscriptions.add(
      this.model$.pipe(take(1)).subscribe(m => {
        this.user = m.user;
        this.createForm();
      })
    );
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

  async save(model: IModel) {
    if (this.registerForm.valid) {
      this.saveSub.next(true);
      const paymentResult = model.tenant.usePaymentGateway ? await this.payment.createPayment() : { status: 'OK', token: 'MANUALPAYMENT' };

      if (paymentResult.status === 'OK') {
        this.subscriptions.add(this.userApi.registerTeams(model.season.id, this.teams.value, paymentResult.token)
          .pipe(
            catchError((response: HttpErrorResponse) => {
              return of({ success: false, error: response.error });
            }),
            finalize(() => this.saveSub.next(false)))
          .subscribe((result: ITeamRegisterResult) => {
            if (result.success) {
              this.router.navigate(['./done'], { relativeTo: this.route, state: { 'payment': result.messages } });
            } else {
              this.errorSub.next(result.error);
            }
          }));
      } else {
        this.saveSub.next(false);
      }
    }
  }

  handlePaymentErrors(errors: any) {
    this.errorSub.next(errors);
  }

  private convertErrorsToArray(obj: any): string[] {
    if (!obj) { return undefined; }

    if (typeof(obj) === 'string') {
      return [<string>obj];
    }

    if (Array.isArray(obj) && obj.length > 0) {
      if (obj[0] && obj[0].field && obj[0].message && obj[0].type) {
        // looks like a payment error
        return obj.map(x => x.message);
      }
    } else {
      const keys = Object.keys(obj);

      if (keys.length > 0) {
        if (obj[keys[0]].validationState === 1) {
          // looks like a modelstate error
          return keys.map(x => obj[x].errors.map(y => y.errorMessage)).reduce((prev, curr) => [...prev, ...curr], []);
        }
      }
    }

    console.error('unknown error format', obj);
    return undefined;
  }
}
