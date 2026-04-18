import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { RulesService } from '../../services/rules.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TOURNAMENT_STATUS_LABELS, TournamentDetail } from '../../models/tournament.models';
import { TournamentRules } from '../../models/rules.models';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { CoachService } from '../../services/coach.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private readonly tournamentService = inject(TournamentService);
  private readonly rulesService = inject(RulesService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly coachService = inject(CoachService);

  tournament = signal<TournamentDetail | null>(null);
  rules = signal<TournamentRules | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  alreadyRegistered = signal(false);

  constructor() {
    effect(() => {
      const isAuth = this.auth.isAuthenticated();
      const tournament = this.tournament();

      if (tournament) {
        if (isAuth) {
          this.coachService.getMyCoach(tournament.id).subscribe({
            next: (coach) => this.alreadyRegistered.set(coach !== null),
            error: () => this.alreadyRegistered.set(false),
          });
        } else {
          this.alreadyRegistered.set(false);
        }
      }
    });
  }

  // Countdown
  countdown = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private countdownInterval?: ReturnType<typeof setInterval>;

  // Bouton inscription visible si PLANNED et utilisateur non connecté ou connecté (pas admin)
  showInscriptionButton = computed(() => {
    const t = this.tournament();
    if (!t || t.status !== 'PLANNED') return false;

    const now = new Date().toISOString().split('T')[0];
    if (now > t.registrationDeadline) return false;
    return !this.alreadyRegistered();
  });

  showModifierButton = computed(() => {
    const t = this.tournament();
    return t?.status === 'PLANNED' && this.alreadyRegistered();
  });

  readonly statusLabels = TOURNAMENT_STATUS_LABELS;

  ngOnInit(): void {
    this.tournamentService.getCurrent().subscribe({
      next: (tournament) => {
        this.tournament.set(tournament);

        this.loading.set(false);
        this.startCountdown(tournament.eventDate);
        if (tournament.id) {
          this.rulesService.getByTournament(tournament.id).subscribe({
            next: (rules) => this.rules.set(rules),
            error: () => this.rules.set(null),
          });
        }
      },
      error: () => {
        this.error.set('Impossible de charger les informations du tournoi.');
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  private startCountdown(tournamentDateStr: string): void {
    const tick = () => {
      const now = new Date().getTime();
      const target = new Date(tournamentDateStr).getTime();
      const diff = target - now;

      if (diff <= 0) {
        this.countdown.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(this.countdownInterval);
        return;
      }

      this.countdown.set({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    this.countdownInterval = setInterval(tick, 1000);
  }

  categoriesGrouped = computed(() => {
    const cats = this.rules()?.rosterCategories ?? [];
    const map = new Map<number, string[]>();

    cats.forEach((c) => {
      if (!map.has(c.categoryValue)) {
        map.set(c.categoryValue, []);
      }
      map.get(c.categoryValue)!.push(c.raceName);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([value, races]) => ({ value, races }));
  });

  onInscriptionClick(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/inscription']);
    } else {
      this.modalService.redirectAfterLogin.set('/inscription');
      this.modalService.openLogin();
    }
  }
}
