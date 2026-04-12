import { inject, Injectable } from '@angular/core';
import { TournamentRules, TournamentRulesCreateUpdate } from '../models/rules.models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/events`;

  getByEvent(eventId: number): Observable<TournamentRules> {
    return this.http.get<TournamentRules>(`${this.apiUrl}/${eventId}/rules`, {
      withCredentials: true,
    });
  }

  create(eventId: number, dto: TournamentRulesCreateUpdate): Observable<TournamentRules> {
    return this.http.post<TournamentRules>(`${this.apiUrl}/${eventId}/rules`, dto, {
      withCredentials: true,
    });
  }

  update(eventId: number, dto: TournamentRulesCreateUpdate): Observable<TournamentRules> {
    return this.http.put<TournamentRules>(`${this.apiUrl}/${eventId}/rules`, dto, {
      withCredentials: true,
    });
  }

  cloneFrom(targetEventId: number, sourceEventId: number): Observable<TournamentRules> {
    return this.http.post<TournamentRules>(
      `${this.apiUrl}/${targetEventId}/rules/clone-from/${sourceEventId}`,
      {},
      { withCredentials: true },
    );
  }
}
