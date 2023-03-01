import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, finalize, map, Observable, of, ReplaySubject, Subject, Subscription, tap } from 'rxjs';
import { SquarePayComponent } from '../components/square-pay/square-pay.component';
import { ICompetition, IRegister, IRegisterResult } from '../laststand.types';
import { LastStandStateService } from '../services/laststand-state.service';
import { LastStandService } from '../services/laststand.service';

interface IRegisterForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  tips: FormArray<FormControl<number | null>>;
  payment: FormControl<boolean | null>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private saveSub = new BehaviorSubject<boolean>(false);
  save$ = this.saveSub.asObservable().pipe(
    map(x => ({ saving: x })),
    tap(x => {
      if (x.saving) { this.form.disable(); } else { this.form.enable(); }
    })
  );

  competition!: ICompetition;

  private errorSub = new Subject<any>();
  error$!: Observable<string[] | undefined>;

  private resultSub = new ReplaySubject<IRegisterResult>(1);
  result$ = this.resultSub.asObservable();

  @ViewChild('payment') payment!: SquarePayComponent;

  private subscriptions!: Subscription;

  form!: FormGroup<IRegisterForm>;
  view$ = new BehaviorSubject<'loading' | 'form'>('loading');

  constructor(private state: LastStandStateService, private svc: LastStandService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();

    this.subscriptions.add(this.state.competition$.subscribe(comp => {
      this.form = new FormGroup<IRegisterForm>({
        'name': new FormControl<string>('', Validators.required),
        'email': new FormControl<string>('', Validators.required),
        'tips': new FormArray<FormControl<number | null>>(
          comp.rounds.map(x => new FormControl<number | null>(null, Validators.required))
        ),
        'payment': new FormControl<boolean>(false, Validators.requiredTrue)
      });
      this.competition = comp;
      this.view$.next('form');
    }));

    this.error$ = this.errorSub.pipe(map(x => this.convertErrorsToArray(x)));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async save(): Promise<void> {
    if (this.form.valid) {
      this.saveSub.next(true);
      const paymentResult = await this.payment.createPayment();

      if (paymentResult.status === 'OK') {
        const item: IRegister = {
          name: <string>this.form.value.name,
          email: <string>this.form.value.email,
          tips: <number[]>this.form.value.tips,
          paymentToken: <string>paymentResult.token,
          competitionId: this.competition.id,
        };
        this.subscriptions.add(this.svc.registerEntry(item)
          .pipe(
            catchError((response: HttpErrorResponse) => {
              console.info(response.error);
              return of({ success: false, error: response.error });
            }),
            finalize(() => this.saveSub.next(false)))
          .subscribe((result: IRegisterResult) => {
            if (result.success) {
              this.router.navigate(['/registered'], { state: { 'payment': result } });
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

  private convertErrorsToArray(obj: any): string[] | undefined {
    if (!obj) { return undefined; }

    if (typeof (obj) === 'string') {
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
        return keys.map(x => obj[x]).reduce((prev, curr) => [...prev, ...curr], []);
      }
    }

    console.error('unknown error format', obj);
    return undefined;
  }

  handlePaymentValid(evt: boolean): void {
    this.form.get('payment')?.setValue(evt);
  }
}
