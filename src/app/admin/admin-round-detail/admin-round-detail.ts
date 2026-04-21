import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { RoundService } from '../../services/round.service';
import { MatchService } from '../../services/match.service';
import { CoachService } from '../../services/coach.service';
import { Round, RoundStatus } from '../../models/round.models';
import { Match, MatchCreate } from '../../models/match.models';
import { CoachParticipant } from '../../models/coach.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-round-detail',
  imports: [RouterLink, FormsModule],
  templateUrl: './admin-round-detail.html',
  styleUrl: './admin-round-detail.css',
})
export class AdminRoundDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tournamentService = inject(TournamentService);
  private readonly roundService = inject(RoundService);
  private readonly matchService = inject(MatchService);
  private readonly coachService = inject(CoachService);

  eventId = signal<number | null>(null);
  roundId = signal<number | null>(null);
  round = signal<Round | null>(null);
  matches = signal<Match[]>([]);
  validatedCoaches = signal<CoachParticipant[]>([]);

  isLoading = signal(true);
  isGenerating = signal(false);
  isSubmittingChallenge = signal(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Formulaire défi
  showChallengeForm = signal(false);
  challengeCoach1Id = signal<number | null>(null);
  challengeCoach2Id = signal<number | null>(null);

  ngOnInit() {
    const roundId = Number(this.route.snapshot.paramMap.get('id'));
    this.roundId.set(roundId);

    this.tournamentService.getCurrent().subscribe({
      next: (tournament) => {
        this.eventId.set(tournament.id);
        this.loadAll(tournament.id, roundId);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le tournoi courant.');
        this.isLoading.set(false);
      },
    });
  }

  private loadAll(eventId: number, roundId: number): void {
    // Charge le round
    this.roundService.getById(eventId, roundId).subscribe({
      next: (round) => this.round.set(round),
      error: () => this.errorMessage.set('Impossible de charger le round.'),
    });

    // Charge les matches
    this.matchService.getAll(eventId, roundId).subscribe({
      next: (matches) => {
        this.matches.set(matches);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les matches.');
        this.isLoading.set(false);
      },
    });
    // Charge les coaches validés pour le formulaire défi
    this.coachService.getParticipants(eventId).subscribe({
      next: (coaches) => this.validatedCoaches.set(coaches),
    });
  }

  generatePairings(): void {
    const eventId = this.eventId();
    const roundId = this.roundId();
    if (!eventId || !roundId) return;

    this.isGenerating.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.matchService.generatePairings(eventId, roundId).subscribe({
      next: (matches) => {
        this.matches.set(matches);
        this.successMessage.set('Appariements générés avec succès !');
        this.isGenerating.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ?? 'Erreur lors de la génération des appariements.',
        );
        this.isGenerating.set(false);
      },
    });
  }

  updateStatus(status: RoundStatus): void {
    const eventId = this.eventId();
    const roundId = this.roundId();
    if (!eventId || !roundId) return;

    this.roundService.update(eventId, roundId, { status }).subscribe({
      next: (round) => {
        this.round.set(round);
        this.successMessage.set('Statut du round mis à jour.');
        this.errorMessage.set(null);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Erreur lors de la mise à jour du statut.');
      },
    });
  }

  toggleChallengeForm(): void {
    this.showChallengeForm.set(!this.showChallengeForm());
    this.resetChallengeForm();
  }

  submitChallenge(): void {
    const eventId = this.eventId();
    const roundId = this.roundId();
    const coach1Id = this.challengeCoach1Id();
    const coach2Id = this.challengeCoach2Id();

    if (!eventId || !roundId || !coach1Id || !coach2Id) return;
    if (coach1Id === coach2Id) {
      this.errorMessage.set('Les deux coaches doivent être différents.');
      return;
    }

    this.isSubmittingChallenge.set(true);
    this.errorMessage.set(null);

    const dto: MatchCreate = { coach1Id, coach2Id };

    this.matchService.createChallenge(eventId, roundId, dto).subscribe({
      next: (match) => {
        this.matches.update((matches) => [...matches, match]);
        this.successMessage.set('Défi enregistré avec succès !');
        this.isSubmittingChallenge.set(false);
        this.resetChallengeForm();
        this.showChallengeForm.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? "Erreur lors de l'enregistrement du défi.");
        this.isSubmittingChallenge.set(false);
      },
    });
  }

  private resetChallengeForm(): void {
    this.challengeCoach1Id.set(null);
    this.challengeCoach2Id.set(null);
  }

  // Exclut les coaches déjà dans un match du round
  availableCoaches(): CoachParticipant[] {
    const pairedIds = new Set<number>();
    this.matches().forEach((m) => {
      pairedIds.add(m.coach1.id);
      pairedIds.add(m.coach2.id);
    });
    return this.validatedCoaches().filter((c) => !pairedIds.has(c.id));
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'FINISHED':
        return 'Terminé';
      default:
        return status;
    }
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'badge-neutral';
      case 'IN_PROGRESS':
        return 'badge-warning';
      case 'FINISHED':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  }

  matchStatusLabel(status: string): string {
    return status === 'FINISHED' ? 'Terminé' : 'En attente';
  }
}
