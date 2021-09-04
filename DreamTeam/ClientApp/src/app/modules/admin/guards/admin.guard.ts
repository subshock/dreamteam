import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService, IUser } from '../../../../api-authorization/authorize.service';
import { map, tap } from 'rxjs/operators';
import { ApplicationPaths, ApplicationRoles, QueryParameterNames } from '../../../../api-authorization/api-authorization.constants';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authorize: AuthorizeService, private router: Router) {
  }
  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authorize.isAdmin()
        .pipe(
          tap(isAdmin => this.handleAuthorization(isAdmin, state))
        );
  }

  private handleAuthorization(isAdmin: boolean, state: RouterStateSnapshot) {
    if (!isAdmin) {
      // TODO: show not allowed
      this.router.navigate(ApplicationPaths.LoginPathComponents, {
        queryParams: {
          [QueryParameterNames.ReturnUrl]: state.url
        }
      });
    }
  }
}
