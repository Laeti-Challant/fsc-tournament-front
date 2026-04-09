import { computed, Injectable, signal } from '@angular/core';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../models/auth.models';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUser = signal<AuthResponseDTO | null>(null);

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

  checkSession(): Observable<void> {
    return this.http
      .get<AuthResponseDTO>(`${environment.apiUrl}/users/me`, { withCredentials: true })
      .pipe(
        tap((response) => this.currentUser.set(response)),
        catchError(() => {
          this.currentUser.set(null);
          return of(void 0);
        }),
        map(() => void 0),
      );
  }
}
