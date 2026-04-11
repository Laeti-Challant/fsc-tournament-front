import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { EventService } from '../../services/event.service';
import { RulesService } from '../../services/rules.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { EVENT_STATUS_LABELS, EventDetail } from '../../models/event.models';
import { TournamentRules } from '../../models/rules.models';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private readonly eventService = inject(EventService);
  private readonly rulesService = inject(RulesService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  event = signal<EventDetail | null>(null);
  rules = signal<TournamentRules | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Countdown
  countdown = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private countdownInterval?: ReturnType<typeof setInterval>;

  // Bouton inscription visible si PLANNED et utilisateur non connecté ou connecté (pas admin)
  showInscriptionButton = computed(() => {
    const e = this.event();
    return e?.status === 'PLANNED';
  });

  readonly statusLabels = EVENT_STATUS_LABELS;

  ngOnInit(): void {
    this.eventService.getCurrent().subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
        this.startCountdown(event.eventDate);
        if (event.id) {
          this.rulesService.getByEvent(event.id).subscribe({
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

  private startCountdown(eventDateStr: string): void {
    const tick = () => {
      const now = new Date().getTime();
      const target = new Date(eventDateStr).getTime();
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
      this.router.navigate(['/login']);
    }
  }
}
