import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Login } from '../../auth/login/login';
import { Register } from '../../auth/register/register';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Login, Register],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);
  modalService = inject(ModalService);

  logout() {
    this.authService.logout().subscribe();
  }
}
