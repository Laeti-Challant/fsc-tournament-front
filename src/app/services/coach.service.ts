import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Page } from '../models/user.models';
import {
  CoachAdminUpdate,
  CoachCreate,
  CoachDetail,
  CoachMeal,
  CoachParticipant,
  CoachSummary,
  CoachUpdate,
} from '../models/coach.models';

@Injectable({
  providedIn: 'root',
})
export class CoachService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tournaments`;

  getAllByTournament(tournamentId: number, page = 0, size = 20): Observable<Page<CoachSummary>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<CoachSummary>>(`${this.apiUrl}/${tournamentId}/coaches`, {
      params,
      withCredentials: true,
    });
  }

  getById(tournamentId: number, coachId: number): Observable<CoachDetail> {
    return this.http.get<CoachDetail>(`${this.apiUrl}/${tournamentId}/coaches/${coachId}`, {
      withCredentials: true,
    });
  }

  getMyCoach(tournamentId: number): Observable<CoachDetail> {
    return this.http.get<CoachDetail>(`${this.apiUrl}/${tournamentId}/coaches/me`, {
      withCredentials: true,
    });
  }

  getParticipants(tournamentId: number): Observable<CoachParticipant[]> {
    return this.http.get<CoachParticipant[]>(
      `${this.apiUrl}/${tournamentId}/coaches/participants`,
      { withCredentials: true },
    );
  }

  getMealsByTournament(tournamentId: number): Observable<CoachMeal[]> {
    return this.http.get<CoachMeal[]>(`${this.apiUrl}/${tournamentId}/coaches/meals`, {
      withCredentials: true,
    });
  }

  register(tournamentId: number, dto: CoachCreate): Observable<CoachDetail> {
    return this.http.post<CoachDetail>(`${this.apiUrl}/${tournamentId}/coaches`, dto, {
      withCredentials: true,
    });
  }

  updateMe(tournamentId: number, dto: CoachUpdate): Observable<CoachDetail> {
    return this.http.put<CoachDetail>(`${this.apiUrl}/${tournamentId}/coaches/me`, dto, {
      withCredentials: true,
    });
  }

  adminUpdate(
    tournamentId: number,
    coachId: number,
    dto: CoachAdminUpdate,
  ): Observable<CoachDetail> {
    return this.http.put<CoachDetail>(`${this.apiUrl}/${tournamentId}/coaches/${coachId}`, dto, {
      withCredentials: true,
    });
  }

  delete(tournamentId: number, coachId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tournamentId}/coaches/${coachId}`, {
      withCredentials: true,
    });
  }
}
