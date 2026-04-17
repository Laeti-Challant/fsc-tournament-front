import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CoachService } from '../../services/coach.service';
import { RulesService } from '../../services/rules.service';
import { Router, RouterLink } from '@angular/router';
import { EventDetail } from '../../models/event.models';
import { RosterCategory } from '../../models/rules.models';
import { CoachCreate, CoachUpdate } from '../../models/coach.models';

@Component({
  selector: 'app-inscription',
  imports: [FormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly coachService = inject(CoachService);
  private readonly rulesService = inject(RulesService);
  private readonly router = inject(Router);

  tournament = signal<EventDetail | null>(null);
  races = signal<RosterCategory[]>([]);
  alreadyRegistered = signal(false);
  registrationClosed = signal(false);
  tournamentFull = signal(false);
  loading = signal(true);
  editMode = signal(false);
  rosterLink: string | null = null;

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  form: CoachCreate = {
    coachPseudo: '',
    teamName: '',
    race: '',
    eating: false,
    vegetarian: false,
  };

  ngOnInit(): void {
    this.loadTournament();
  }

  private loadTournament(): void {
    // Utiliser le signal si déjà chargé, sinon appeler getCurrent
    const cached = this.eventService.currentEvent();
    if (cached) {
      this.onTournamentLoaded(cached);
    } else {
      this.eventService.getCurrent().subscribe({
        next: (event) => this.onTournamentLoaded(event),
        error: () => {
          this.errorMessage.set('Aucun tournoi en cours.');
          this.loading.set(false);
        },
      });
    }
  }

  private onTournamentLoaded(event: EventDetail): void {
    this.tournament.set(event);

    // Vérifier si les inscriptions sont ouvertes
    const now = new Date().toISOString().split('T')[0];
    if (event.status !== 'PLANNED' || now > event.registrationDeadline) {
      this.registrationClosed.set(true);
      this.loading.set(false);
      return;
    }

    // Charger les races et vérifier l'inscription en parallèle
    this.loadRaces(event.id);
    this.checkExistingRegistration(event.id);
  }

  private loadRaces(tournamentId: number): void {
    this.rulesService.getByEvent(tournamentId).subscribe({
      next: (rules) => this.races.set(rules.rosterCategories),
      error: () => this.errorMessage.set('Impossible de charger les races disponibles.'),
    });
  }

  private checkExistingRegistration(tournamentId: number): void {
    this.coachService.getMyCoach(tournamentId).subscribe({
      next: (coach) => {
        if (coach) {
          this.editMode.set(true);
          this.form = {
            coachPseudo: coach.coachPseudo,
            teamName: coach.teamName,
            race: coach.race,
            eating: coach.eating,
            vegetarian: coach.vegetarian,
          };
          this.rosterLink = coach.rosterLink;
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    this.clearMessages();
    const tournamentId = this.tournament()?.id;
    if (!tournamentId) return;

    // Si eating est false, forcer vegetarian à false
    if (!this.form.eating) {
      this.form.vegetarian = false;
    }

    this.coachService.register(tournamentId, this.form).subscribe({
      next: () => {
        this.successMessage.set('Inscription réussie !');
        setTimeout(() => this.router.navigate(['/profil']), 1500);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage.set(err.error || 'Inscription impossible.');
        } else if (err.status === 400) {
          this.errorMessage.set(err.error || 'Données invalides.');
        } else {
          this.errorMessage.set("Erreur lors de l'inscription.");
        }
      },
    });
  }

  update(): void {
    this.clearMessages();
    const tournamentId = this.tournament()?.id;
    if (!tournamentId) return;

    if (!this.form.eating) {
      this.form.vegetarian = false;
    }

    const dto: CoachUpdate = {
      ...this.form,
      rosterLink: this.rosterLink,
    };

    this.coachService.updateMe(tournamentId, dto).subscribe({
      next: () => {
        this.successMessage.set('Inscription mise à jour !');
        setTimeout(() => this.router.navigate(['/profil']), 1500);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage.set(err.error || 'Modification impossible.');
        } else if (err.status === 400) {
          this.errorMessage.set(err.error || 'Données invalides.');
        } else {
          this.errorMessage.set('Erreur lors de la modification.');
        }
      },
    });
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}
