import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Round, RoundUpdate } from '../models/round.models';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getAll(eventId: number): Observable<Round[]> {
    return this.http.get<Round[]>(`${this.apiUrl}/events/${eventId}/rounds`, {
      withCredentials: true,
    });
  }

  getById(eventId: number, roundId: number): Observable<Round> {
    return this.http.get<Round>(`${this.apiUrl}/events/${eventId}/rounds/${roundId}`, {
      withCredentials: true,
    });
  }

  generateAll(eventId: number): Observable<Round[]> {
    return this.http.post<Round[]>(
      `${this.apiUrl}/events/${eventId}/rounds/generate`,
      {},
      { withCredentials: true },
    );
  }

  update(eventId: number, roundId: number, dto: RoundUpdate): Observable<Round> {
    return this.http.put<Round>(`${this.apiUrl}/events/${eventId}/rounds/${roundId}`, dto, {
      withCredentials: true,
    });
  }
}
