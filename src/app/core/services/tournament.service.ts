import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  TournamentCreateUpdate,
  TournamentDetail,
  TournamentSummary,
} from '../models/tournament.models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private readonly http = inject(HttpClient);
  private readonly eventsUrl = `${environment.apiUrl}/events`;
  private readonly tournamentsUrl = `${environment.apiUrl}/tournaments`;

  activeTournaments = signal<TournamentDetail[]>([]);
  selectedTournament = signal<TournamentDetail | null>(null);

  loadActive(): Observable<TournamentDetail[]> {
    return this.http
      .get<TournamentDetail[]>(`${this.tournamentsUrl}/active`, { withCredentials: true })
      .pipe(
        tap((tournaments) => {
          this.activeTournaments.set(tournaments);
          const featured = tournaments.find((t) => t.featured) ?? tournaments[0] ?? null;
          this.selectedTournament.set(featured);
        }),
      );
  }

  selectTournament(tournament: TournamentDetail): void {
    this.selectedTournament.set(tournament);
  }

  getAll(): Observable<TournamentSummary[]> {
    return this.http.get<TournamentSummary[]>(this.eventsUrl, { withCredentials: true });
  }

  getCurrent(): Observable<TournamentDetail> {
    return this.http
      .get<TournamentDetail>(`${this.tournamentsUrl}/current`, { withCredentials: true })
      .pipe(tap((t) => this.selectedTournament.set(t)));
  }

  getActive(): Observable<TournamentDetail[]> {
    return this.http.get<TournamentDetail[]>(`${this.tournamentsUrl}/active`, {
      withCredentials: true,
    });
  }

  getById(id: number): Observable<TournamentDetail> {
    return this.http.get<TournamentDetail>(`${this.eventsUrl}/${id}`, { withCredentials: true });
  }

  create(dto: TournamentCreateUpdate): Observable<TournamentDetail> {
    return this.http.post<TournamentDetail>(this.tournamentsUrl, dto, { withCredentials: true });
  }

  update(id: number, dto: TournamentCreateUpdate): Observable<TournamentDetail> {
    return this.http.put<TournamentDetail>(`${this.tournamentsUrl}/${id}`, dto, {
      withCredentials: true,
    });
  }
}
