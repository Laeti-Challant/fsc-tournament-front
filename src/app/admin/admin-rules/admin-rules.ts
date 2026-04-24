import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TournamentService } from '../../services/tournament.service';
import { RulesService } from '../../services/rules.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentDetail } from '../../models/tournament.models';
import { TournamentRules } from '../../models/rules.models';

@Component({
  selector: 'app-admin-rules',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-rules.html',
  styleUrl: './admin-rules.css',
})
export class AdminRules implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tournamentService = inject(TournamentService);
  private readonly rulesService = inject(RulesService);
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  tournament = signal<TournamentDetail | null>(null);
  previousTournament = signal<TournamentDetail | null>(null);
  isEditMode = signal(false);
  loading = signal(true);
  submitting = signal(false);
  cloning = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    budgetPo: [1_050_000, [Validators.required, Validators.min(1)]],
    pspPool: [30, [Validators.required, Validators.min(1)]],
    maxSkillsPerPlayer: [2, [Validators.required, Validators.min(1)]],
    resurrectionMode: [false],
    mogettePspValue: [5, [Validators.required, Validators.min(1)]],
    mogettePoValue: [25_000, [Validators.required, Validators.min(1)]],
    notesText: [''],
    rosterText: [''],
    allowedInducements: this.fb.array([]),
    rosterCategories: this.fb.array([]),
  });

  get inducements(): FormArray {
    return this.form.get('allowedInducements') as FormArray;
  }

  get rosterCategories(): FormArray {
    return this.form.get('rosterCategories') as FormArray;
  }

  ngOnInit(): void {
    const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));

    this.tournamentService.getById(tournamentId).subscribe({
      next: (tournament) => {
        this.tournament.set(tournament);
        this.tournamentService.selectTournament(tournament);

        this.rulesService.getByTournament(tournament.id).subscribe({
          next: (rules) => {
            this.isEditMode.set(true);
            this.patchForm(rules);
            this.loading.set(false);
          },
          error: () => {
            this.isEditMode.set(false);
            this.loadPreviousTournament();
          },
        });
      },
      error: () => {
        this.errorMessage.set('Tournoi introuvable.');
        this.loading.set(false);
      },
    });
  }

  private loadPreviousTournament(): void {
    this.tournamentService.getAll().subscribe({
      next: (tournaments) => {
        const previous = tournaments
          .filter((e) => e.id !== this.tournament()?.id && e.status === 'FINISHED')
          .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())[0];
        if (previous) {
          this.previousTournament.set(previous as any);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  cloneFromPrevious(): void {
    const prev = this.previousTournament();
    const curr = this.tournament();
    if (!prev || !curr) return;

    this.cloning.set(true);
    this.errorMessage.set(null);

    this.rulesService.cloneFrom(curr.id, prev.id).subscribe({
      next: (rules) => {
        this.isEditMode.set(true);
        this.patchForm(rules);
        this.successMessage.set('Ruleset cloné depuis ' + prev.name);
        this.cloning.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erreur lors du clonage.');
        this.cloning.set(false);
      },
    });
  }

  private patchForm(rules: TournamentRules): void {
    this.form.patchValue({
      budgetPo: rules.budgetPo,
      pspPool: rules.pspPool,
      maxSkillsPerPlayer: rules.maxSkillsPerPlayer,
      resurrectionMode: rules.resurrectionMode,
      mogettePspValue: rules.mogettePspValue,
      mogettePoValue: rules.mogettePoValue,
      notesText: rules.notesText ?? '',
      rosterText: rules.rosterText ?? '',
    });

    this.inducements.clear();
    rules.allowedInducements?.forEach((i) =>
      this.inducements.push(this.newInducement(i.name, i.minQty, i.maxQty)),
    );

    this.rosterCategories.clear();
    rules.rosterCategories?.forEach((c) =>
      this.rosterCategories.push(this.newCategory(c.raceName, c.categoryValue, c.isMinus)),
    );
  }

  // ── Inducements ──────────────────────────────────────
  newInducement(name = '', minQty = 0, maxQty = 1): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      minQty: [minQty, [Validators.required, Validators.min(0)]],
      maxQty: [maxQty, [Validators.required, Validators.min(1)]],
    });
  }

  addInducement(): void {
    this.inducements.push(this.newInducement());
  }

  removeInducement(index: number): void {
    this.inducements.removeAt(index);
  }

  // ── Catégories ───────────────────────────────────────
  newCategory(raceName = '', categoryValue = 0, isMinus = false): FormGroup {
    return this.fb.group({
      raceName: [raceName, Validators.required],
      categoryValue: [categoryValue, [Validators.required, Validators.min(0)]],
      isMinus: [isMinus],
    });
  }

  addCategory(): void {
    this.rosterCategories.push(this.newCategory());
  }

  removeCategory(index: number): void {
    this.rosterCategories.removeAt(index);
  }

  // ── Submit ───────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const dto = this.form.getRawValue();
    const tournamentId = this.tournament()!.id!;

    const request$ = this.isEditMode()
      ? this.rulesService.update(tournamentId, dto)
      : this.rulesService.create(tournamentId, dto);

    request$.subscribe({
      next: () => {
        this.successMessage.set(
          this.isEditMode() ? 'Ruleset mis à jour avec succès.' : 'Ruleset créé avec succès.',
        );
        this.isEditMode.set(true);
        this.submitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Une erreur est survenue.');
        this.submitting.set(false);
      },
    });
  }
}
