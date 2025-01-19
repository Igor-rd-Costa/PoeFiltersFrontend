import { Routes } from '@angular/router';
import { FilterPageComponent } from './pages/filter-page/filter-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: FilterPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
];
