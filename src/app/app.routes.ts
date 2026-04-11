import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminUsers } from './admin/admin-users/admin-users';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((c) => c.Home),
  },
  /*
    {
        path: 'profil', 
        loadComponent: () => import('./pages/profil/profil').then(c => c.ProfilComponent)
    },
    {
        path: 'inscription',
        loadComponent: () => import('./pages/inscription/inscription').then(c => c.InscriptionComponent),
        canActivate: [authGuard]  
    },
*/
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
