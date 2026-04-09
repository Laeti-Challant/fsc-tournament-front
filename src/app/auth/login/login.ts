import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { LoginDTO } from '../../models/auth.models';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  modalService = inject(ModalService);

  isOpen = input<boolean>(false);
  onClose = output<void>();

  formData: LoginDTO = { email: '', password: '' };
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  close() {
    this.errorMessage.set(null);
    this.formData = { email: '', password: '' };
    this.onClose.emit();
  }

  switchToRegister() {
    this.modalService.openRegister();
  }

  submit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.close();
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Email ou mot de passe incorrect.');
        } else {
          this.errorMessage.set('Une erreur est survenue, réessaie plus tard.');
        }
      },
    });
  }
}
