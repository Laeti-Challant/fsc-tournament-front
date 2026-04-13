import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Page } from '../models/user.models';
import { CoachDetail, CoachSummary, CoachUpdate } from '../models/coach.models';

@Injectable({
  providedIn: 'root',
})
export class CoachService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  getAllByevent(eventId: number, page = 0, size = 20): Observable<Page<CoachSummary>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<Page<CoachSummary>>(`${this.apiUrl}/${eventId}/coaches`, {
      params,
      withCredentials: true,
    });
  }

  getbyId(eventId: number, coachId: number): Observable<CoachDetail> {
    return this.http.get<CoachDetail>(`${this.apiUrl}/${eventId}/coaches/${coachId}`, {
      withCredentials: true,
    });
  }

  getMealByEvent(eventId: number, page = 0, size = 100): Observable<Page<CoachDetail>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<Page<CoachDetail>>(`${this.apiUrl}/${eventId}/coaches/meals`, {
      params,
      withCredentials: true,
    });
  }

  register(eventId: number, coachId: number, dto: CoachUpdate): Observable<CoachDetail> {
    return this.http.post<CoachDetail>(`${this.apiUrl}/${eventId}/coaches/${coachId}`, dto, {
      withCredentials: true,
    });
  }

  delete(eventId: number, coachId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/coaches/${coachId}`, {
      withCredentials: true,
    });
  }
}
