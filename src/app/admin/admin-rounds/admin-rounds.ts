import { Component, inject, OnInit, signal } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { RoundService } from '../../services/round.service';
import { Round } from '../../models/round.models';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-rounds',
  imports: [RouterLink],
  templateUrl: './admin-rounds.html',
  styleUrl: './admin-rounds.css',
})
export class AdminRounds implements OnInit {
  private readonly tournamentService = inject(TournamentService);
  private readonly roundService = inject(RoundService);
  private readonly route = inject(ActivatedRoute);

  eventId = signal<number | null>(null);
  rounds = signal<Round[]>([]);
  isLoading = signal(true);
  isGenerating = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit() {
    const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));

    this.tournamentService.getById(tournamentId).subscribe({
      next: (tournament) => {
        this.eventId.set(tournament.id);
        this.tournamentService.selectTournament(tournament);
        this.loadRounds(tournamentId);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le tournoi courant.');
        this.isLoading.set(false);
      },
    });
  }

  private loadRounds(eventId: number): void {
    this.roundService.getAll(eventId).subscribe({
      next: (rounds) => {
        this.rounds.set(rounds);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les rounds.');
        this.isLoading.set(false);
      },
    });
  }

  generateRounds(): void {
    const eventId = this.eventId();
    if (!eventId) return;

    this.isGenerating.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.roundService.generateAll(eventId).subscribe({
      next: (rounds) => {
        this.rounds.set(rounds);
        this.successMessage.set(`${rounds.length} rounds générés avec succès !`);
        this.isGenerating.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Erreur lors de la génération des rounds.');
        this.isGenerating.set(false);
      },
    });
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
}
