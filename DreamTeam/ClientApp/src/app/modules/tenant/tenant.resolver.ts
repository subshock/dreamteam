import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PublicApiService } from 'src/app/services/public-api.service';
import { IPublicTenant } from 'src/app/types/public.types';
import { TenantModule } from './tenant.module';

@Injectable({
  providedIn: 'root'
})
export class TenantResolver implements Resolve<IPublicTenant | null> {

  constructor(private publicApi: PublicApiService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPublicTenant | null> | null {
    const slug = route.paramMap.get('slug');

    if (!slug) {
      this.router.navigate(['/t']);
      return null;
    }

    return this.publicApi.getTenant(slug).pipe(
      catchError(() => {
        this.router.navigate(['/t']);
        return of(null);
      })
    );
  }
}
