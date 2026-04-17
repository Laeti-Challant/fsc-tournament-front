import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminUsers } from './admin/admin-users/admin-users';
import { AdminEvent } from './admin/admin-event/admin-event';
import { AdminRules } from './admin/admin-rules/admin-rules';
import { Profil } from './pages/profil/profil';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((c) => c.Home),
  },

  {
    path: 'profil',
    loadComponent: () => import('./pages/profil/profil').then((c) => c.Profil),
  },

  {
    path: 'inscription',
    loadComponent: () => import('./pages/inscription/inscription').then((c) => c.Inscription),
    canActivate: [authGuard],
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboard,
      },
      {
        path: 'users',
        component: AdminUsers,
      },
      {
        path: 'event',
        component: AdminEvent,
      },
      {
        path: 'rules',
        component: AdminRules,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
