import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import {
  UserDTO,
  UserUpdateEmailDTO,
  UserUpdatePasswordDTO,
  UserUpdatePseudoDTO,
} from '../../models/user.models';

@Component({
  selector: 'app-profil',
  imports: [FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  private userService = inject(UserService);

  user = signal<UserDTO | null>(null);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  pseudoForm: UserUpdatePseudoDTO = { pseudo: '' };

  emailForm: UserUpdateEmailDTO = {
    email: '',
    confirmPassword: '',
  };

  passwordForm: UserUpdatePasswordDTO = {
    newPassword: '',
    confirmPassword: '',
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getMe().subscribe({
      next: (data) => {
        this.user.set(data);
        this.pseudoForm.pseudo = data.pseudo;
        this.emailForm.email = data.email;
      },
      error: () => this.errorMessage.set('Impossible de charger le profil.'),
    });
  }

  updatePseudo(): void {
    this.clearMessages();
    this.userService.updatePseudo(this.pseudoForm).subscribe({
      next: (data) => {
        this.user.set(data);
        this.successMessage.set('Pseudo mis à jour !');
      },
      error: () => this.errorMessage.set('Erreur lors de la mise à jour du pseudo.'),
    });
  }

  updateEmail(): void {
    this.clearMessages();
    this.userService.updateEmail(this.emailForm).subscribe({
      next: (data) => {
        this.user.set(data);
        this.successMessage.set('Email mis à jour !');
      },
      error: () => this.errorMessage.set("Erreur lors de la mise à jour de l'email."),
    });
  }

  updatePassword(): void {
    this.clearMessages();
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }
    this.userService.updatePassword(this.passwordForm).subscribe({
      next: () => {
        this.passwordForm = { newPassword: '', confirmPassword: '' };
        this.successMessage.set('Mot de passe mis à jour !');
      },
      error: () => this.errorMessage.set('Erreur lors de la mise à jour du mot de passe.'),
    });
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}
