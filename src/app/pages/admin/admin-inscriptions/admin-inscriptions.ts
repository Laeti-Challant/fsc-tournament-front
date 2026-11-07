import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CoachService } from '../../../core/services/coach.service';
import { TournamentService } from '../../../core/services/tournament.service';
import { TournamentDetail } from '../../../core/models/tournament.models';
import { CoachSummary } from '../../../core/models/coach.models';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-inscriptions',
  imports: [RouterLink],
  templateUrl: './admin-inscriptions.html',
  styleUrl: './admin-inscriptions.css',
})
export class AdminInscriptions implements OnInit {
  private readonly coachService = inject(CoachService);
  private readonly tournamentService = inject(TournamentService);
  private readonly route = inject(ActivatedRoute);

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
    const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));

    this.tournamentService.getById(tournamentId).subscribe({
      next: (tournament) => {
        this.tournament.set(tournament);
        this.tournamentService.selectTournament(tournament);
        this.loadCoaches(tournamentId);
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

  exportParticipants(): void {
    Promise.all([import('exceljs'), import('file-saver')]).then(([ExcelJS, { saveAs }]) => {
      const validated = this.coaches().filter((c) => c.status === 'VALIDATED');

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Participants');

      sheet.columns = [
        { header: '#', key: 'num', width: 6 },
        { header: 'Pseudo', key: 'pseudo', width: 22 },
        { header: 'Équipe', key: 'equipe', width: 28 },
        { header: 'Race', key: 'race', width: 22 },
      ];

      sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' },
        };
      });

      validated.forEach((c, i) => {
        sheet.addRow({
          num: i + 1,
          pseudo: c.coachPseudo,
          equipe: c.teamName,
          race: c.race,
        });
      });

      // Ligne total
      const totalRow = sheet.addRow({
        num: '',
        pseudo: 'TOTAL',
        equipe: `${validated.length} participants`,
        race: '',
      });
      totalRow.font = { bold: true };

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `participants-${this.tournament()?.name ?? 'tournoi'}.xlsx`);
      });
    });
  }
}
