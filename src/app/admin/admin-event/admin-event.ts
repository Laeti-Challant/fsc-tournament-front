import { Component, inject, OnInit, signal } from '@angular/core';
import { EventDetail } from '../../models/event.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-event',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-event.html',
  styleUrl: './admin-event.css',
})
export class AdminEvent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  protected readonly router = inject(Router);

  existingEvent = signal<EventDetail | null>(null);
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
    this.eventService.getCurrent().subscribe({
      next: (event) => {
        this.existingEvent.set(event);
        this.isEditMode.set(true);
        this.patchForm(event);
        this.loading.set(false);
      },
      error: () => {
        this.isEditMode.set(false);
        this.loading.set(false);
      },
    });
  }

  private patchForm(event: EventDetail): void {
    this.form.patchValue({
      name: event.name,
      eventDate: event.eventDate,
      registrationDeadline: event.registrationDeadline,
      maxParticipants: event.maxParticipants,
      nbRounds: event.nbRounds,
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
    const event = this.existingEvent();

    const request$ =
      this.isEditMode() && event
        ? this.eventService.update(event.id, dto)
        : this.eventService.create(dto);

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
