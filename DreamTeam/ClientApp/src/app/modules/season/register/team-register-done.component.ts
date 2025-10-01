import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentType } from '../../../types/payment-type.enum';

@Component({
  templateUrl: './team-register-done.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamRegisterDoneComponent implements OnInit {

  payment: any;
  paymentMethod: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.payment = history.state.payment;
    this.paymentMethod = history.state.paymentMethod || PaymentType.Manual;

    if (!this.payment) {
      this.router.navigate(['/my/teams']);
    }
  }
}
