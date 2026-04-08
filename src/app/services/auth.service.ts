import { computed, Injectable, signal } from '@angular/core';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../models/auth.models';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUser = signal<AuthResponseDTO | null>(null);

  // Dérivés du signal
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  pseudo = computed(() => this.currentUser()?.pseudo ?? null);

  constructor(private http: HttpClient) {}

  register(data: RegisterDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, data, {
      withCredentials: true,
    });
  }

  login(data: LoginDTO): Observable<AuthResponseDTO> {
    return this.http
      .post<AuthResponseDTO>(`${this.apiUrl}/login`, data, {
        withCredentials: true,
      })
      .pipe(tap((response) => this.currentUser.set(response)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(tap(() => this.currentUser.set(null)));
  }
}
