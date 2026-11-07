import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Page, UserAdminUpdateDTO, UserDTO } from '../../../core/models/user.models';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  imports: [RouterLink],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers {
  userService = inject(UserService);
  authService = inject(AuthService);

  page = signal<Page<UserDTO> | null>(null);
  isLoading = signal(true);
  currentPage = signal(0);
  pageSize = 10;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getUsers(this.currentPage(), this.pageSize).subscribe({
      next: (p) => {
        this.page.set(p);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  goToPage(pageNumber: number) {
    this.currentPage.set(pageNumber);
    this.loadUsers();
  }

  getPages(): number[] {
    const total = this.page()?.totalPages ?? 0;
    return Array.from({ length: total }, (_, i) => i);
  }

  toggleRole(user: UserDTO) {
    const update: UserAdminUpdateDTO = {
      role: user.role === 'ADMIN' ? 'PLAYER' : 'ADMIN',
      active: user.active,
    };
    this.userService.updateUser(user.id, update).subscribe({
      next: () => this.loadUsers(),
    });
  }

  toggleActive(user: UserDTO) {
    const update: UserAdminUpdateDTO = {
      role: user.role,
      active: !user.active,
    };
    this.userService.updateUser(user.id, update).subscribe({
      next: () => this.loadUsers(),
    });
  }
}
