import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  showLogin = signal(false);
  showRegister = signal(false);
  redirectAfterLogin = signal<string | null>(null);

  openLogin() {
    this.showLogin.set(true);
    this.showRegister.set(false);
  }

  openRegister() {
    this.showRegister.set(true);
    this.showLogin.set(false);
  }

  closeAll() {
    this.showLogin.set(false);
    this.showRegister.set(false);
  }
}
