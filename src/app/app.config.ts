import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FilterService } from './services/FilterService';
import { ViewService } from './services/ViewService';
import { ItemService } from './services/ItemService';
import { AuthService } from './services/AuthService';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient(), 
    provideRouter(routes), FilterService, ViewService, ItemService, AuthService]
};
