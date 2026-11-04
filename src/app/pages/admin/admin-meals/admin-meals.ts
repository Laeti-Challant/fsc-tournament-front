import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CoachService } from '../../../core/services/coach.service';
import { TournamentService } from '../../../core/services/tournament.service';
import { TournamentDetail } from '../../../core/models/tournament.models';
import { CoachMeal } from '../../../core/models/coach.models';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-meals',
  imports: [RouterLink],
  templateUrl: './admin-meals.html',
  styleUrl: './admin-meals.css',
})
export class AdminMeals implements OnInit {
  private readonly coachService = inject(CoachService);
  private readonly tournamentService = inject(TournamentService);
  private readonly route = inject(ActivatedRoute);

  tournament = signal<TournamentDetail | null>(null);
  meals = signal<CoachMeal[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  totalMeals = computed(() => this.meals().length);
  totalVegetarian = computed(() => this.meals().filter((m) => m.vegetarian).length);
  totalNonVegetarian = computed(() => this.totalMeals() - this.totalVegetarian());

  ngOnInit(): void {
    const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));

    this.tournamentService.getById(tournamentId).subscribe({
      next: (tournament) => {
        this.tournament.set(tournament);
        this.tournamentService.selectTournament(tournament);
        this.loadMeals(tournamentId);
      },
      error: () => {
        this.error.set('Impossible de charger le tournoi.');
        this.loading.set(false);
      },
    });
  }

  private loadMeals(tournamentId: number): void {
    this.coachService.getMealsByTournament(tournamentId).subscribe({
      next: (data) => {
        this.meals.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger la liste des repas.');
        this.loading.set(false);
      },
    });
  }

  exportExcel(): void {
    Promise.all([import('exceljs'), import('file-saver')]).then(([ExcelJS, { saveAs }]) => {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Repas');

      // En-têtes
      sheet.columns = [
        { header: '#', key: 'num', width: 6 },
        { header: 'Pseudo', key: 'pseudo', width: 22 },
        { header: 'Équipe', key: 'equipe', width: 28 },
        { header: 'Race', key: 'race', width: 22 },
        { header: 'Végétarien', key: 'vege', width: 15 },
      ];

      // Style en-tête
      sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' },
        };
      });

      // Données
      this.meals().forEach((m, i) => {
        sheet.addRow({
          num: i + 1,
          pseudo: m.coachPseudo,
          equipe: m.teamName,
          race: m.race,
          vege: m.vegetarian ? 'Oui' : 'Non',
        });
      });

      // Ligne de totaux
      const totalRow = sheet.addRow({
        num: '',
        pseudo: 'TOTAL',
        equipe: `${this.totalMeals()} repas`,
        race: '',
        vege: `${this.totalVegetarian()} végé / ${this.totalNonVegetarian()} non-végé`,
      });
      totalRow.font = { bold: true };

      // Génération et téléchargement
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `repas-${this.tournament()?.name ?? 'tournoi'}.xlsx`);
      });
    });
  }
}
