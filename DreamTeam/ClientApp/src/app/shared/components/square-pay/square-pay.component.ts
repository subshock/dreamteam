import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { PaymentSettingsService } from 'src/app/services/payment-settings.service';
import { Card, CardInputEvent, Payments, SqEvent } from '@square/web-payments-sdk-types';
import { Subscription } from 'rxjs';

declare var window: any;

@Component({
  selector: 'app-square-pay',
  template: '<div #tpl></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SquarePayComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() loaded = new EventEmitter<boolean>();
  @Output() paymentToken = new EventEmitter<string>();
  @Output() error = new EventEmitter<any>();
  @Output() valid = new EventEmitter<boolean>();

  @ViewChild('tpl') tpl: ElementRef;

  private paymentsObj: Payments;
  private cardObj: Card;

  private subscriptions: Subscription;

  constructor(private dynScriptService: DynamicScriptLoaderService,
    private paymentSvc: PaymentSettingsService) { }

  async ngOnInit() {
    this.subscriptions = new Subscription();
    const dynScripts = await this.dynScriptService.load('square');

    const loaded = dynScripts && dynScripts.length === 1 && !!dynScripts[0].loaded && !!window.Square;
    this.loaded.emit(loaded);

    if (loaded) {
      this.subscriptions.add(this.paymentSvc.settings$.subscribe(async settings => {
        try {
          this.paymentsObj = await window.Square.payments(settings.applicationId, settings.locationId);
          this.cardObj = await this.paymentsObj.card();
          this.cardObj.addEventListener('errorClassAdded', (evt) => this.onErrorState(evt));
          this.cardObj.addEventListener('errorClassRemoved', (evt) => this.onErrorState(evt));
          await this.cardObj.attach(this.tpl.nativeElement);
        } catch (err) {
          this.error.emit(err);
        }
      }));
    }
  }

  ngAfterViewInit(): void {
  }

  async ngOnDestroy() {
    this.subscriptions.unsubscribe();

    if (this.cardObj) {
      await this.cardObj.destroy();
    }
  }

  async createPayment() {
    const result = await this.cardObj.tokenize();
    if (result.status === 'OK') {
      this.paymentToken.emit(result.token);
    } else {
      this.error.emit(result.errors);
    }
    return result;
  }

  onErrorState(event: SqEvent<CardInputEvent>) {
    this.valid.emit(event.detail.currentState.isCompletelyValid);
  }
}
