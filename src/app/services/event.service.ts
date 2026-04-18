import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EventCreateUpdate, EventDetail, EventSummary } from '../models/event.models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly eventsUrl = `${environment.apiUrl}/events`;
  private readonly tournamentsUrl = `${environment.apiUrl}/tournaments`;

  currentEvent = signal<EventDetail | null>(null);

  getAll(): Observable<EventSummary[]> {
    return this.http.get<EventSummary[]>(this.eventsUrl, { withCredentials: true });
  }

  getCurrent(): Observable<EventDetail> {
    return this.http
      .get<EventDetail>(`${this.tournamentsUrl}/current`, { withCredentials: true })
      .pipe(tap((event) => this.currentEvent.set(event)));
  }

  getById(id: number): Observable<EventDetail> {
    return this.http.get<EventDetail>(`${this.eventsUrl}/${id}`, { withCredentials: true });
  }

  create(dto: EventCreateUpdate): Observable<EventDetail> {
    return this.http.post<EventDetail>(this.tournamentsUrl, dto, { withCredentials: true });
  }

  update(id: number, dto: EventCreateUpdate): Observable<EventDetail> {
    return this.http.put<EventDetail>(`${this.tournamentsUrl}/${id}`, dto, {
      withCredentials: true,
    });
  }
}
