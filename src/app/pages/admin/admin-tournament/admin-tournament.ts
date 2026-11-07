import { Component, inject, OnInit, signal } from '@angular/core';
import { TournamentDetail } from '../../../core/models/tournament.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TournamentService } from '../../../core/services/tournament.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-tournament',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-tournament.html',
  styleUrl: './admin-tournament.css',
})
export class AdminTournament implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tournamentService = inject(TournamentService);
  private readonly route = inject(ActivatedRoute);
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
    location: [''],
    address: [''],
    postalCode: ['', [Validators.pattern('^[0-9]{5}$')]],
    city: [''],
    featured: [false],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.tournamentService.getById(Number(id)).subscribe({
        next: (tournament) => {
          this.existingTournament.set(tournament);
          this.isEditMode.set(true);
          this.patchForm(tournament);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Tournoi introuvable.');
          this.loading.set(false);
        },
      });
    } else {
      this.isEditMode.set(false);
      this.loading.set(false);
    }
  }

  private patchForm(tournament: TournamentDetail): void {
    this.form.patchValue({
      name: tournament.name,
      eventDate: tournament.eventDate,
      registrationDeadline: tournament.registrationDeadline,
      maxParticipants: tournament.maxParticipants,
      nbRounds: tournament.nbRounds,
      location: tournament.location,
      address: tournament.address,
      postalCode: tournament.postalCode,
      city: tournament.city,
      featured: tournament.featured,
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
          this.isEditMode() ? 'Tournoi mis à jour avec succès.' : 'Tournoi créé avec succès.',
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
