import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../../core/services/tournament.service';
import { MatchService } from '../../../core/services/match.service';
import { CoachResultService } from '../../../core/services/coach-result.service';
import { Match } from '../../../core/models/match.models';
import { CoachResult, CoachResultCreate, MatchResultCreate } from '../../../core/models/coachresult.models';

@Component({
  selector: 'app-admin-match-result',
  imports: [FormsModule],
  templateUrl: './admin-match-result.html',
  styleUrl: './admin-match-result.css',
})
export class AdminMatchResult implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tournamentService = inject(TournamentService);
  private readonly matchService = inject(MatchService);
  private readonly coachResultService = inject(CoachResultService);

  eventId = signal<number | null>(null);
  tournamentId = signal<number | null>(null);
  roundId = signal<number | null>(null);
  matchId = signal<number | null>(null);

  match = signal<Match | null>(null);
  existingResults = signal<CoachResult[]>([]);

  isLoading = signal(true);
  isSubmitting = signal(false);
  isEditMode = signal(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Formulaire coach 1
  result1 = signal<'WIN' | 'LOSS' | 'DRAW'>('WIN');
  touchdowns1 = signal(0);
  casualties1 = signal(0);
  objectives1 = signal(0);
  bonusObjective1 = signal(false);
  passes1 = signal(0);
  foulActions1 = signal(0);

  // Formulaire coach 2 — result2 est calculé automatiquement
  result2 = computed<'WIN' | 'LOSS' | 'DRAW'>(() => {
    switch (this.result1()) {
      case 'WIN':
        return 'LOSS';
      case 'LOSS':
        return 'WIN';
      case 'DRAW':
        return 'DRAW';
    }
  });
  touchdowns2 = signal(0);
  casualties2 = signal(0);
  objectives2 = signal(0);
  bonusObjective2 = signal(false);
  passes2 = signal(0);
  foulActions2 = signal(0);

  hasResults = computed(() => this.existingResults().length === 2);
  ngOnInit() {
    const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));
    const roundId = Number(this.route.snapshot.paramMap.get('roundId'));
    const matchId = Number(this.route.snapshot.paramMap.get('matchId'));
    this.tournamentId.set(tournamentId);
    this.roundId.set(roundId);
    this.matchId.set(matchId);

    this.tournamentService.getById(tournamentId).subscribe({
      next: (tournament) => {
        this.eventId.set(tournament.id);
        this.tournamentService.selectTournament(tournament);
        this.loadAll(tournament.id, roundId, matchId);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le tournoi.');
        this.isLoading.set(false);
      },
    });
  }

  private loadAll(eventId: number, roundId: number, matchId: number): void {
    this.matchService.getById(eventId, roundId, matchId).subscribe({
      next: (match) => {
        this.match.set(match);
        this.loadResults(eventId, roundId, matchId);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le match.');
        this.isLoading.set(false);
      },
    });
  }

  private loadResults(eventId: number, roundId: number, matchId: number): void {
    this.coachResultService.getByMatch(eventId, roundId, matchId).subscribe({
      next: (results) => {
        this.existingResults.set(results);
        if (results.length === 2) {
          this.prefillForm(results);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les résultats.');
        this.isLoading.set(false);
      },
    });
  }

  private prefillForm(results: CoachResult[]): void {
    const match = this.match();
    if (!match) return;

    // On identifie quel résultat correspond à coach1 et coach2
    const r1 = results.find((r) => r.coach.id === match.coach1.id);
    const r2 = results.find((r) => r.coach.id === match.coach2.id);
    if (!r1 || !r2) return;

    this.result1.set(r1.result as 'WIN' | 'LOSS' | 'DRAW');
    this.touchdowns1.set(r1.touchdowns);
    this.casualties1.set(r1.casualties);
    this.objectives1.set(r1.objectives);
    this.bonusObjective1.set(r1.bonusObjective);
    this.passes1.set(r1.passes);
    this.foulActions1.set(r1.foulActions);

    this.touchdowns2.set(r2.touchdowns);
    this.casualties2.set(r2.casualties);
    this.objectives2.set(r2.objectives);
    this.bonusObjective2.set(r2.bonusObjective);
    this.passes2.set(r2.passes);
    this.foulActions2.set(r2.foulActions);
  }

  enableEdit(): void {
    this.isEditMode.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  submit(): void {
    const eventId = this.eventId();
    const roundId = this.roundId();
    const matchId = this.matchId();
    const match = this.match();
    if (!eventId || !roundId || !matchId || !match) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const dto: MatchResultCreate = {
      coach1Result: this.buildCoachResultCreate(
        match.coach1.id,
        this.result1(),
        this.touchdowns1(),
        this.casualties1(),
        this.objectives1(),
        this.bonusObjective1(),
        this.passes1(),
        this.foulActions1(),
      ),
      coach2Result: this.buildCoachResultCreate(
        match.coach2.id,
        this.result2(),
        this.touchdowns2(),
        this.casualties2(),
        this.objectives2(),
        this.bonusObjective2(),
        this.passes2(),
        this.foulActions2(),
      ),
    };

    const call$ = this.hasResults()
      ? this.coachResultService.update(eventId, roundId, matchId, dto)
      : this.coachResultService.create(eventId, roundId, matchId, dto);

    call$.subscribe({
      next: (results) => {
        this.existingResults.set(results);
        this.isEditMode.set(false);
        this.isSubmitting.set(false);
        this.successMessage.set('Résultat enregistré avec succès !');
        // Retour vers le round après 1,5s
        setTimeout(
          () =>
            this.router.navigate(['/admin/rounds', this.tournamentId(), 'detail', this.roundId()]),
          1500,
        );
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? "Erreur lors de l'enregistrement.");
        this.isSubmitting.set(false);
      },
    });
  }

  private buildCoachResultCreate(
    coachId: number,
    result: 'WIN' | 'LOSS' | 'DRAW',
    touchdowns: number,
    casualties: number,
    objectives: number,
    bonusObjective: boolean,
    passes: number,
    foulActions: number,
  ): CoachResultCreate {
    return {
      coachId,
      result,
      touchdowns,
      casualties,
      objectives,
      bonusObjective,
      passes,
      foulActions,
    };
  }

  goBack(): void {
    this.router.navigate(['/admin/rounds', this.tournamentId(), 'detail', this.roundId()]);
  }

  resultLabel(result: 'WIN' | 'LOSS' | 'DRAW'): string {
    switch (result) {
      case 'WIN':
        return 'Victoire';
      case 'LOSS':
        return 'Défaite';
      case 'DRAW':
        return 'Match nul';
    }
  }

  resultBadgeClass(result: 'WIN' | 'LOSS' | 'DRAW'): string {
    switch (result) {
      case 'WIN':
        return 'badge-success';
      case 'LOSS':
        return 'badge-error';
      case 'DRAW':
        return 'badge-warning';
    }
  }
}
