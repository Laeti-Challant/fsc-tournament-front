import { inject, Injectable } from '@angular/core';
import { TournamentRules, TournamentRulesCreateUpdate } from '../models/rules.models';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tournaments`;

  getByTournament(tournamentId: number): Observable<TournamentRules> {
    return this.http.get<TournamentRules>(`${this.apiUrl}/${tournamentId}/rules`, {
      withCredentials: true,
    });
  }

  create(tournamentId: number, dto: TournamentRulesCreateUpdate): Observable<TournamentRules> {
    return this.http.post<TournamentRules>(`${this.apiUrl}/${tournamentId}/rules`, dto, {
      withCredentials: true,
    });
  }

  update(tournamentId: number, dto: TournamentRulesCreateUpdate): Observable<TournamentRules> {
    return this.http.put<TournamentRules>(`${this.apiUrl}/${tournamentId}/rules`, dto, {
      withCredentials: true,
    });
  }

  cloneFrom(targettournamentId: number, sourcetournamentId: number): Observable<TournamentRules> {
    return this.http.post<TournamentRules>(
      `${this.apiUrl}/${targettournamentId}/rules/clone-from/${sourcetournamentId}`,
      {},
      { withCredentials: true },
    );
  }
}
