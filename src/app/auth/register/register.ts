import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { RegisterDTO } from '../../models/auth.models';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  modalService = inject(ModalService);

  isOpen = input<boolean>(false);
  onClose = output<void>();

  formData: RegisterDTO = { email: '', pseudo: '', password: '' };
  confirmPassword = signal('');
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  close() {
    this.errorMessage.set(null);
    this.formData = { email: '', pseudo: '', password: '' };
    this.confirmPassword.set('');
    this.onClose.emit();
  }

  switchToLogin() {
    this.modalService.openLogin();
  }

  submit() {
    if (this.formData.password !== this.confirmPassword()) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.close();
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 409) {
          this.errorMessage.set('Cet email est déjà utilisé.');
        } else {
          this.errorMessage.set('Une erreur est survenue, réessaie plus tard.');
        }
      },
    });
  }
}
