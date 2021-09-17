import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { IPaymentSettings } from '../types/public.types';
import { PublicApiService } from './public-api.service';

@Injectable({ providedIn: 'root' })
export class PaymentSettingsService {
  public settings$: Observable<IPaymentSettings>;

  constructor(private publicApi: PublicApiService) {
    this.settings$ = this.publicApi.getPaymentSettings().pipe(
      shareReplay(1)
    );
  }
}
