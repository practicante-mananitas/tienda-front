import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(FormsModule)
  ]
};

