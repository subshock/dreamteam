import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IPaymentDetail } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentViewComponent implements OnInit {

  model$: Observable<IPaymentDetail>;

  constructor(private adminApi: AdminApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.model$ = this.route.paramMap.pipe(
      switchMap(p => this.adminApi.getPaymentDetails(p.get('id')))
    );
  }
}
