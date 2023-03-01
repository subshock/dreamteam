import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { Card, CardInputEvent, Payments, SqEvent } from '@square/web-payments-sdk-types';
import { from, of, Subscription } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { LastStandService } from 'src/app/services/laststand.service';

declare var window: any;

@Component({
  selector: 'app-square-pay',
  template: '<div #tpl></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SquarePayComponent implements OnInit, OnDestroy {

  @Output() loaded = new EventEmitter<boolean>();
  @Output() paymentToken = new EventEmitter<string>();
  @Output() error = new EventEmitter<any>();
  @Output() valid = new EventEmitter<boolean>();

  @ViewChild('tpl') tpl!: ElementRef;

  private paymentsObj!: Payments;
  private cardObj!: Card;

  private subscriptions!: Subscription;

  constructor(private dynScriptService: DynamicScriptLoaderService,
    private svc: LastStandService) { }

  async ngOnInit() {
    this.subscriptions = new Subscription();

    this.subscriptions.add(this.svc.getPaymentSettings().pipe(
      shareReplay(1),
      switchMap(settings => from(this.dynScriptService.loadScript({ name: 'square', src: settings.webSdkUrl }))
        .pipe(map(r => ({ settings: settings, scriptLoad: r })))),
      filter(model => model.scriptLoad.loaded && !!window.Square)
    ).subscribe(async model => {

      this.loaded.emit(model.scriptLoad.loaded);

      try {
        this.paymentsObj = await window.Square.payments(model.settings.applicationId, model.settings.locationId);
        this.cardObj = await this.paymentsObj.card();
        this.cardObj.addEventListener('errorClassAdded', (evt: SqEvent<CardInputEvent>) => this.onErrorState(evt));
        this.cardObj.addEventListener('errorClassRemoved', (evt: SqEvent<CardInputEvent>) => this.onErrorState(evt));
        await this.cardObj.attach(this.tpl.nativeElement);
      } catch (err) {
        this.error.emit(err);
      }
    }));
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
