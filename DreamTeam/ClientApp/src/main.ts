import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function getBaseUrl() {
  const baseHref = document.getElementsByTagName('base')[0].href;
  return baseHref;
}

const providers = [
  { provide: APP_BASE_HREF, useFactory: getBaseUrl, deps: [] }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
