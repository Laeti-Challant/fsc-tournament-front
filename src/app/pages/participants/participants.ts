import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CoachService } from '../../services/coach.service';
import { TournamentService } from '../../services/tournament.service';
import { TournamentDetail } from '../../models/tournament.models';
import { CoachParticipant } from '../../models/coach.models';

@Component({
  selector: 'app-participants',
  imports: [],
  templateUrl: './participants.html',
  styleUrl: './participants.css',
})
export class Participants implements OnInit {
  private readonly coachService = inject(CoachService);
  private readonly tournamentService = inject(TournamentService);

  tournament = signal<TournamentDetail | null>(null);
  participants = signal<CoachParticipant[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Tri
  sortField = signal<'coachPseudo' | 'teamName' | 'race'>('coachPseudo');
  sortAsc = signal(true);

  sortedParticipants = computed(() => {
    const list = [...this.participants()];
    const field = this.sortField();
    const asc = this.sortAsc();

    list.sort((a, b) => {
      const valA = a[field].toLowerCase();
      const valB = b[field].toLowerCase();
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return list;
  });

  ngOnInit(): void {
    this.tournamentService.getCurrent().subscribe({
      next: (tournament) => {
        this.tournament.set(tournament);
        this.loadParticipants(tournament.id);
      },
      error: () => {
        this.error.set('Impossible de charger le tournoi.');
        this.loading.set(false);
      },
    });
  }

  private loadParticipants(tournamentId: number): void {
    this.coachService.getParticipants(tournamentId).subscribe({
      next: (data) => {
        this.participants.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger la liste des participants.');
        this.loading.set(false);
      },
    });
  }

  toggleSort(field: 'coachPseudo' | 'teamName' | 'race'): void {
    if (this.sortField() === field) {
      this.sortAsc.set(!this.sortAsc());
    } else {
      this.sortField.set(field);
      this.sortAsc.set(true);
    }
  }

  getSortIcon(field: string): string {
    if (this.sortField() !== field) return '↕';
    return this.sortAsc() ? '↑' : '↓';
  }
}
