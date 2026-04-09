import { inject } from '@angular/core/primitives/di';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }
  // Connecté mais pas admin → redirige vers l'accueil
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  // Non connecté → ouvre la modale login et redirige vers l'accueil
  const modalService = inject(ModalService);
  modalService.openLogin();
  return router.createUrlTree(['/']);
};
