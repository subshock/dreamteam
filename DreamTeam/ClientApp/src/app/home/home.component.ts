import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPTY, from, Observable } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { SeasonStateType } from '../modules/admin/admin.types';
import { DynamicScriptLoaderService } from '../services/dynamic-script-loader.service';
import { PublicApiService } from '../services/public-api.service';
import { UserApiService } from '../services/user-api.service';
import { IPublicSeasonInfo } from '../types/public.types';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

  season$: Observable<IPublicSeasonInfo>;
  SeasonStateType = SeasonStateType;
  isAuthenticated$: Observable<boolean>;

  appId = 'sandbox-sq0idb-pHaYthURQMlaDcs0p_JsrQ';
  locationId = 'LQC1841QPQ005';
  payment$: Observable<any>;
  private payments: any;
  private card: any;
  @ViewChild('cardContainer') cardContainer: ElementRef;

  constructor(private publicApi: PublicApiService, private authService: AuthorizeService,
    private dynScriptService: DynamicScriptLoaderService, private userApi: UserApiService) { }

  ngOnInit(): void {
    this.season$ = this.publicApi.getCurrentSeason();
    this.isAuthenticated$ = this.authService.isAuthenticated();

    this.payment$ = from(this.dynScriptService.load('square'))
      .pipe(
        map(result => ({ paymentAvailable: result?.length > 0 && !!result[0].loaded && !!window.Square })),
        tap(result => {
          if (!result.paymentAvailable) { return; }

          setTimeout(async () => {
            try {
              this.payments = window.Square.payments(this.appId, this.locationId);
              await this.initializeCard(this.payments);
            } catch (error) {
              console.error(error);
            }
          });
        })
      );

    // then(async result => {
    //       let payments;
    //       try {
    //         payments = window.Square.payments(this.appId, this.locationId);
    //       } catch {
    //         const statusContainer = document.getElementById(
    //           'payment-status-container'
    //         );
    //         statusContainer.className = 'missing-credentials';
    //         statusContainer.style.visibility = 'visible';
    //         return;
    //       }

    //       let card;
    //       try {
    //         card = await this.initializeCard(payments);
    //       } catch (e) {
    //         console.error('Initializing Card failed', e);
    //         return;
    //       }

    //       const cardButton = document.getElementById('card-button');
    //       cardButton.addEventListener('click', async (event) => {
    //         await this.handlePaymentMethodSubmission(event, card);
    //       });
    //     }
    //   });
  }

  ngOnDestroy(): void {
    if (this.cardContainer && this.payments && this.card) {
      this.card.destroy();
    }
  }

  async initializeCard(payments) {
    if (!this.card) {
      this.card = await payments.card();
    }

    if (!this.cardContainer) {
      return setTimeout(async () => {
        console.info('checking for cardContainer');
        return this.initializeCard(payments);
      });
    }

    console.info('attaching card');
    this.card.attach(this.cardContainer.nativeElement);

    return this.card;
  }

  // status is either SUCCESS or FAILURE;
  displayPaymentResults(status) {
    const statusContainer = document.getElementById(
      'payment-status-container'
    );
    if (status === 'SUCCESS') {
      statusContainer.classList.remove('is-failure');
      statusContainer.classList.add('is-success');
    } else {
      statusContainer.classList.remove('is-success');
      statusContainer.classList.add('is-failure');
    }

    statusContainer.style.visibility = 'visible';
  }


  async createPayment(token) {
    const body = JSON.stringify({
      locationId: this.locationId,
      sourceId: token,
    });

    const paymentResponse = await fetch('/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (paymentResponse.ok) {
      return paymentResponse.json();
    }

    const errorBody = await paymentResponse.text();
    throw new Error(errorBody);
  }

  async tokenize(paymentMethod): Promise<string> {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(
          tokenResult.errors
        )}`;
      }

      throw new Error(errorMessage);
    }
  }

  async pay(data: any) {
    const verifyBuyerDetails = {
      amount: '25.00',
      currencyCode: 'AUD',
      intent: 'CHARGE',
      billingContact: {
        addressLines: ['123 Main Street', 'Apartment 1'],
        familyName: 'Doe',
        givenName: 'John',
        email: 'jondoe@gmail.com',
        country: 'GB',
        phone: '3214563987',
        region: 'LND',
        city: 'London'
      }
    };
    const token = await this.tokenize(this.card);
    const verification = await this.payments.verifyBuyer(token, verifyBuyerDetails);
    console.info('verify', token, verification);

    const sub = this.makePayment(token, verification.token).subscribe(result => {
      console.info('payment result', result);
      sub.unsubscribe();
    });
  }

  makePayment(token: string, verificationId): Observable<any> {
    console.info('token', token, 'verficationId', verificationId);
    return this.userApi.registerTeams('604b8b84-324c-46d8-837a-a28e49bdb3b4', [{ name: 'Test', owner: 'Owner' }], token, verificationId);
  }
}
