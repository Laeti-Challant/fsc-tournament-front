import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

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
          import('./pages/admin/admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/admin-users/admin-users').then((c) => c.AdminUsers),
      },
      {
        path: 'tournament/new',
        loadComponent: () =>
          import('./pages/admin/admin-tournament/admin-tournament').then((c) => c.AdminTournament),
      },
      {
        path: 'tournament/:id',
        loadComponent: () =>
          import('./pages/admin/admin-tournament/admin-tournament').then((c) => c.AdminTournament),
      },
      {
        path: 'tournament',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'rules/:tournamentId',
        loadComponent: () => import('./pages/admin/admin-rules/admin-rules').then((c) => c.AdminRules),
      },
      {
        path: 'inscriptions/:tournamentId',
        loadComponent: () =>
          import('./pages/admin/admin-inscriptions/admin-inscriptions').then((c) => c.AdminInscriptions),
      },
      {
        path: 'menus/:tournamentId',
        loadComponent: () => import('./pages/admin/admin-menus/admin-menus').then((c) => c.AdminMenus),
      },
      {
        path: 'meals/:tournamentId',
        loadComponent: () => import('./pages/admin/admin-meals/admin-meals').then((c) => c.AdminMeals),
      },
      {
        path: 'rounds/:tournamentId',
        loadComponent: () => import('./pages/admin/admin-rounds/admin-rounds').then((c) => c.AdminRounds),
      },
      {
        path: 'rounds/:tournamentId/detail/:roundId',
        loadComponent: () =>
          import('./pages/admin/admin-round-detail/admin-round-detail').then((c) => c.AdminRoundDetail),
      },
      {
        path: 'rounds/:tournamentId/matches/:matchId',
        loadComponent: () =>
          import('./pages/admin/admin-match-result/admin-match-result').then((c) => c.AdminMatchResult),
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
