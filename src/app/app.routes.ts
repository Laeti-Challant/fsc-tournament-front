import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminUsers } from './admin/admin-users/admin-users';
import { AdminTournament } from './admin/admin-tournament/admin-tournament';
import { AdminRules } from './admin/admin-rules/admin-rules';

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
    path: 'participants',
    loadComponent: () => import('./pages/participants/participants').then((c) => c.Participants),
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
        path: 'tournament',
        component: AdminTournament,
      },
      {
        path: 'rules',
        component: AdminRules,
      },
      {
        path: 'meals',
        loadComponent: () => import('./admin/admin-meals/admin-meals').then((c) => c.AdminMeals),
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
