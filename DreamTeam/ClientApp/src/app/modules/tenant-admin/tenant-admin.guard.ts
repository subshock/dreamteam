import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthorizeService, userHasClaim } from 'src/api-authorization/authorize.service';

@Injectable({
  providedIn: 'root'
})
export class TenantAdminGuard implements CanActivate {
  constructor(private authService: AuthorizeService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getUser().pipe(
      map(u => userHasClaim(u, 'tenant', route.paramMap.get('slug')))
    );
  }
}
