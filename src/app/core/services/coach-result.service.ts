import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoachResult, MatchResultCreate } from '../models/coachresult.models';

@Injectable({
  providedIn: 'root',
})
export class CoachResultService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  private url(eventId: number, roundId: number, matchId: number): string {
    return `${this.apiUrl}/events/${eventId}/rounds/${roundId}/matches/${matchId}/results`;
  }

  getByMatch(eventId: number, roundId: number, matchId: number): Observable<CoachResult[]> {
    return this.http.get<CoachResult[]>(this.url(eventId, roundId, matchId), {
      withCredentials: true,
    });
  }

  create(
    eventId: number,
    roundId: number,
    matchId: number,
    dto: MatchResultCreate,
  ): Observable<CoachResult[]> {
    return this.http.post<CoachResult[]>(this.url(eventId, roundId, matchId), dto, {
      withCredentials: true,
    });
  }

  update(
    eventId: number,
    roundId: number,
    matchId: number,
    dto: MatchResultCreate,
  ): Observable<CoachResult[]> {
    return this.http.put<CoachResult[]>(this.url(eventId, roundId, matchId), dto, {
      withCredentials: true,
    });
  }
}
