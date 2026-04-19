import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CoachService } from '../../services/coach.service';
import { TournamentService } from '../../services/tournament.service';
import { TournamentDetail } from '../../models/tournament.models';
import { CoachSummary } from '../../models/coach.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-inscriptions',
  imports: [RouterLink],
  templateUrl: './admin-inscriptions.html',
  styleUrl: './admin-inscriptions.css',
})
export class AdminInscriptions implements OnInit {
  private readonly coachService = inject(CoachService);
  private readonly tournamentService = inject(TournamentService);

  tournament = signal<TournamentDetail | null>(null);
  coaches = signal<CoachSummary[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  actionLoading = signal<number | null>(null);

  // Filtre par statut
  activeFilter = signal<'ALL' | 'PENDING' | 'VALIDATED' | 'REJECTED'>('ALL');

  filteredCoaches = computed(() => {
    const filter = this.activeFilter();
    const list = this.coaches();
    if (filter === 'ALL') return list;
    return list.filter((c) => c.status === filter);
  });

  pendingCount = computed(() => this.coaches().filter((c) => c.status === 'PENDING').length);
  validatedCount = computed(() => this.coaches().filter((c) => c.status === 'VALIDATED').length);
  rejectedCount = computed(() => this.coaches().filter((c) => c.status === 'REJECTED').length);

  ngOnInit(): void {
    this.tournamentService.getCurrent().subscribe({
      next: (tournament) => {
        this.tournament.set(tournament);
        this.loadCoaches(tournament.id);
      },
      error: () => {
        this.error.set('Impossible de charger le tournoi.');
        this.loading.set(false);
      },
    });
  }

  private loadCoaches(tournamentId: number): void {
    this.coachService.getAllByTournament(tournamentId, 0, 1000).subscribe({
      next: (page) => {
        this.coaches.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les inscriptions.');
        this.loading.set(false);
      },
    });
  }

  setFilter(filter: 'ALL' | 'PENDING' | 'VALIDATED' | 'REJECTED'): void {
    this.activeFilter.set(filter);
  }

  validate(coach: CoachSummary): void {
    this.updateStatus(coach, 'VALIDATED');
  }

  reject(coach: CoachSummary): void {
    this.updateStatus(coach, 'REJECTED');
  }

  setPending(coach: CoachSummary): void {
    this.updateStatus(coach, 'PENDING');
  }

  private updateStatus(coach: CoachSummary, newStatus: 'PENDING' | 'VALIDATED' | 'REJECTED'): void {
    const tournamentId = this.tournament()?.id;
    if (!tournamentId) return;

    this.actionLoading.set(coach.id);

    this.coachService
      .adminUpdate(tournamentId, coach.id, {
        status: newStatus,
        rosterStatus: coach.rosterStatus,
        substitute: false,
      })
      .subscribe({
        next: () => {
          this.actionLoading.set(null);
          this.loadCoaches(tournamentId);
        },
        error: () => {
          this.actionLoading.set(null);
          this.error.set('Erreur lors de la mise à jour.');
        },
      });
  }

  deleteCoach(coach: CoachSummary): void {
    const tournamentId = this.tournament()?.id;
    if (!tournamentId) return;

    if (!confirm(`Supprimer l'inscription de ${coach.coachPseudo} ?`)) return;

    this.actionLoading.set(coach.id);

    this.coachService.delete(tournamentId, coach.id).subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.loadCoaches(tournamentId);
      },
      error: () => {
        this.actionLoading.set(null);
        this.error.set('Erreur lors de la suppression.');
      },
    });
  }
}
