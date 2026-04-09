import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  userService = inject(UserService);

  totalUsers = signal<number | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.userService.getUsers(0, 1).subscribe({
      next: (page) => {
        this.totalUsers.set(page.totalElements);
        this.isLoading.set(false);
      },
      error: () => {
        this.totalUsers.set(null);
        this.isLoading.set(false);
      },
    });
  }
}
