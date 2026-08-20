import { Login } from './pages/login/login';
import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard , canActivate: [authGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
