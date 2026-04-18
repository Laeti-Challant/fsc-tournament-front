import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import {
  UserDTO,
  UserUpdateEmailDTO,
  UserUpdatePasswordDTO,
  UserUpdatePseudoDTO,
} from '../../models/user.models';
import { RouterLink } from '@angular/router';
import { CoachService } from '../../services/coach.service';
import { EventService } from '../../services/event.service';
import { EventDetail } from '../../models/event.models';
import { CoachDetail } from '../../models/coach.models';

@Component({
  selector: 'app-profil',
  imports: [FormsModule, RouterLink],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  private userService = inject(UserService);
  private readonly coachService = inject(CoachService);
  private readonly eventService = inject(EventService);

  user = signal<UserDTO | null>(null);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  coach = signal<CoachDetail | null>(null);
  tournament = signal<EventDetail | null>(null);

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
    this.loadInscription();
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

  private loadInscription(): void {
    const cached = this.eventService.currentEvent();
    if (cached) {
      this.onTournamentLoaded(cached);
    } else {
      this.eventService.getCurrent().subscribe({
        next: (event) => this.onTournamentLoaded(event),
        error: () => {}, // Pas de tournoi en cours, on n'affiche rien
      });
    }
  }

  private onTournamentLoaded(event: EventDetail): void {
    this.tournament.set(event);
    this.coachService.getMyCoach(event.id).subscribe({
      next: (coach) => this.coach.set(coach),
      error: () => {}, // Pas inscrit, on n'affiche rien
    });
  }
}
