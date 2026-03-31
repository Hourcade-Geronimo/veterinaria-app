import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then(m => m.RegisterComponent),
      },
    ],
  },
  {
    path: 'users',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/users/user-list/user-list').then(m => m.UserListComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/users/user-detail/user-detail').then(m => m.UserDetailComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
