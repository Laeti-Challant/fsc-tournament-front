import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Menu, MenuCreateUpdate } from '../models/menu.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tournaments`;

  getByTournament(tournamentId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/${tournamentId}/menus`, {
      withCredentials: true,
    });
  }

  create(tournamentId: number, dto: MenuCreateUpdate): Observable<Menu> {
    return this.http.post<Menu>(`${this.apiUrl}/${tournamentId}/menus`, dto, {
      withCredentials: true,
    });
  }

  update(tournamentId: number, menuId: number, dto: MenuCreateUpdate): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/${tournamentId}/menus/${menuId}`, dto, {
      withCredentials: true,
    });
  }

  delete(tournamentId: number, menuId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tournamentId}/menus/${menuId}`, {
      withCredentials: true,
    });
  }
}
