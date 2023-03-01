import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { IRegisterResult } from '../laststand.types';

@Component({
  selector: 'app-register-done',
  templateUrl: './register-done.component.html',
  styleUrls: ['./register-done.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterDoneComponent {
  result$ = new ReplaySubject<IRegisterResult>(1);

  constructor(private router: Router) { }

  ngOnInit(): void {
    const result = history.state.payment;

    this.result$.next(result);

    if (!result) {
      //this.router.navigate(['/']);
    }
  }
}
