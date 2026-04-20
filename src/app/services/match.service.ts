import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Match, MatchCreate } from '../models/match.models';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getAll(eventId: number, roundId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/events/${eventId}/rounds/${roundId}/matches`, {
      withCredentials: true,
    });
  }

  getById(eventId: number, roundId: number, matchId: number): Observable<Match> {
    return this.http.get<Match>(
      `${this.apiUrl}/events/${eventId}/rounds/${roundId}/matches/${matchId}`,
      { withCredentials: true },
    );
  }

  createChallenge(eventId: number, roundId: number, dto: MatchCreate): Observable<Match> {
    return this.http.post<Match>(
      `${this.apiUrl}/events/${eventId}/rounds/${roundId}/matches/challenges`,
      dto,
      { withCredentials: true },
    );
  }

  generatePairings(eventId: number, roundId: number): Observable<Match[]> {
    return this.http.post<Match[]>(
      `${this.apiUrl}/events/${eventId}/rounds/${roundId}/matches/generate-pairings`,
      {},
      { withCredentials: true },
    );
  }
}
