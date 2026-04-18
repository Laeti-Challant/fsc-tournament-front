import { Component, inject, OnInit, signal } from '@angular/core';
import { TournamentDetail } from '../../models/tournament.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TournamentService } from '../../services/tournament.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-tournament',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-tournament.html',
  styleUrl: './admin-tournament.css',
})
export class AdminTournament implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tournamentService = inject(TournamentService);
  protected readonly router = inject(Router);

  existingTournament = signal<TournamentDetail | null>(null);
  isEditMode = signal(false);
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    eventDate: ['', Validators.required],
    registrationDeadline: ['', Validators.required],
    maxParticipants: [24, [Validators.required, Validators.min(2)]],
    nbRounds: [3, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.tournamentService.getCurrent().subscribe({
      next: (tournament) => {
        this.existingTournament.set(tournament);
        this.isEditMode.set(true);
        this.patchForm(tournament);
        this.loading.set(false);
      },
      error: () => {
        this.isEditMode.set(false);
        this.loading.set(false);
      },
    });
  }

  private patchForm(tournament: TournamentDetail): void {
    this.form.patchValue({
      name: tournament.name,
      eventDate: tournament.eventDate,
      registrationDeadline: tournament.registrationDeadline,
      maxParticipants: tournament.maxParticipants,
      nbRounds: tournament.nbRounds,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const dto = this.form.getRawValue() as any;
    const tournament = this.existingTournament();

    const request$ =
      this.isEditMode() && tournament
        ? this.tournamentService.update(tournament.id, dto)
        : this.tournamentService.create(dto);

    request$.subscribe({
      next: () => {
        this.successMessage.set(
          this.isEditMode() ? 'Événement mis à jour avec succès.' : 'Événement créé avec succès.',
        );
        this.submitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Une erreur est survenue.');
        this.submitting.set(false);
      },
    });
  }
}
