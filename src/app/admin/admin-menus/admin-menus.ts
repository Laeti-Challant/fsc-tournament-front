import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { TournamentService } from '../../services/tournament.service';
import { TournamentDetail } from '../../models/tournament.models';
import { Menu, MenuCreateUpdate } from '../../models/menu.models';

@Component({
  selector: 'app-admin-menus',
  imports: [RouterLink, FormsModule],
  templateUrl: './admin-menus.html',
  styleUrl: './admin-menus.css',
})
export class AdminMenus implements OnInit {
  private readonly menuService = inject(MenuService);
  private readonly tournamentService = inject(TournamentService);

  tournament = signal<TournamentDetail | null>(null);
  menus = signal<Menu[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  actionLoading = signal(false);

  // Formulaire
  showForm = signal(false);
  editingMenu = signal<Menu | null>(null);
  formLabel = signal('');
  formDescription = signal('');

  ngOnInit(): void {
    this.tournamentService.getCurrent().subscribe({
      next: (tournament) => {
        this.tournament.set(tournament);
        this.loadMenus(tournament.id);
      },
      error: () => {
        this.error.set('Impossible de charger le tournoi.');
        this.loading.set(false);
      },
    });
  }

  private loadMenus(tournamentId: number): void {
    this.menuService.getByTournament(tournamentId).subscribe({
      next: (menus) => {
        this.menus.set(menus);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les menus.');
        this.loading.set(false);
      },
    });
  }

  openCreateForm(): void {
    this.editingMenu.set(null);
    this.formLabel.set('');
    this.formDescription.set('');
    this.showForm.set(true);
  }

  openEditForm(menu: Menu): void {
    this.editingMenu.set(menu);
    this.formLabel.set(menu.label);
    this.formDescription.set(menu.description ?? '');
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingMenu.set(null);
  }

  submitForm(): void {
    const tournamentId = this.tournament()?.id;
    if (!tournamentId || !this.formLabel().trim()) return;

    this.actionLoading.set(true);

    const dto: MenuCreateUpdate = {
      label: this.formLabel().trim(),
      description: this.formDescription().trim() || null,
    };

    const editing = this.editingMenu();

    const request$ = editing
      ? this.menuService.update(tournamentId, editing.id, dto)
      : this.menuService.create(tournamentId, dto);

    request$.subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.showForm.set(false);
        this.editingMenu.set(null);
        this.loadMenus(tournamentId);
      },
      error: () => {
        this.actionLoading.set(false);
        this.error.set('Erreur lors de la sauvegarde.');
      },
    });
  }

  deleteMenu(menu: Menu): void {
    const tournamentId = this.tournament()?.id;
    if (!tournamentId) return;

    if (!confirm(`Supprimer le menu "${menu.label}" ?`)) return;

    this.actionLoading.set(true);

    this.menuService.delete(tournamentId, menu.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.loadMenus(tournamentId);
      },
      error: () => {
        this.actionLoading.set(false);
        this.error.set('Erreur lors de la suppression.');
      },
    });
  }
}
