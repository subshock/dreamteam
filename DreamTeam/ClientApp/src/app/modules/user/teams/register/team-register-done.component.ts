import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './team-register-done.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamRegisterDoneComponent implements OnInit {

  payment: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.payment = history.state.payment;

    if (!this.payment) {
      this.router.navigate(['/my/teams']);
    }
  }
}
