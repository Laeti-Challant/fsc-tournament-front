import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { TournamentService } from '../../../core/services/tournament.service';
import { CoachService } from '../../../core/services/coach.service';
import { TournamentDetail } from '../../../core/models/tournament.models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private readonly userService = inject(UserService);
  private readonly tournamentService = inject(TournamentService);
  private readonly coachService = inject(CoachService);

  tournament = signal<TournamentDetail | null>(null);
  totalUsers = signal<number | null>(null);
  pendingCount = signal(0);
  validatedCount = signal(0);
  totalMeals = signal(0);
  vegetarianMeals = signal(0);
  isLoading = signal(true);

  activeTournaments = computed(() => this.tournamentService.activeTournaments());

  ngOnInit() {
    this.userService.getUsers(0, 1).subscribe({
      next: (page) => this.totalUsers.set(page.totalElements),
      error: () => this.totalUsers.set(null),
    });

    this.tournamentService.loadActive().subscribe({
      next: (tournaments) => {
        if (tournaments.length > 0) {
          const selected = this.tournamentService.selectedTournament()!;
          this.tournament.set(selected);
          this.loadCoachStats(selected.id);
          this.loadMealStats(selected.id);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  selectTournament(tournament: TournamentDetail): void {
    this.tournamentService.selectTournament(tournament);
    this.tournament.set(tournament);
    this.isLoading.set(true);
    this.loadCoachStats(tournament.id);
    this.loadMealStats(tournament.id);
    this.isLoading.set(false);
  }

  private loadCoachStats(tournamentId: number): void {
    this.coachService.getAllByTournament(tournamentId, 0, 1000).subscribe({
      next: (page) => {
        const coaches = page.content;
        this.pendingCount.set(coaches.filter((c) => c.status === 'PENDING').length);
        this.validatedCount.set(coaches.filter((c) => c.status === 'VALIDATED').length);
      },
    });
  }

  private loadMealStats(tournamentId: number): void {
    this.coachService.getMealsByTournament(tournamentId).subscribe({
      next: (meals) => {
        this.totalMeals.set(meals.length);
        this.vegetarianMeals.set(meals.filter((m) => m.vegetarian).length);
      },
    });
  }
}
