import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

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
        loadComponent: () =>
          import('./admin/admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/admin-users/admin-users').then((c) => c.AdminUsers),
      },
      {
        path: 'tournament',
        loadComponent: () =>
          import('./admin/admin-tournament/admin-tournament').then((c) => c.AdminTournament),
      },
      {
        path: 'rules',
        loadComponent: () => import('./admin/admin-rules/admin-rules').then((c) => c.AdminRules),
      },
      {
        path: 'inscriptions',
        loadComponent: () =>
          import('./admin/admin-inscriptions/admin-inscriptions').then((c) => c.AdminInscriptions),
      },
      {
        path: 'menus',
        loadComponent: () => import('./admin/admin-menus/admin-menus').then((c) => c.AdminMenus),
      },
      {
        path: 'meals',
        loadComponent: () => import('./admin/admin-meals/admin-meals').then((c) => c.AdminMeals),
      },
      {
        path: 'rounds',
        loadComponent: () => import('./admin/admin-rounds/admin-rounds').then((c) => c.AdminRounds),
      },
      // {
      //   path: 'rounds/:id',
      //   loadComponent: () =>
      //     import('./admin/admin-round-detail/admin-round-detail').then((c) => c.AdminRoundDetail),
      // },
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
