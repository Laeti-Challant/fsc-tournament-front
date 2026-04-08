import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { UserAdminUpdateDTO, UserDTO, Page } from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 0, size: number = 10): Observable<Page<UserDTO>> {
    return this.http.get<Page<UserDTO>>(this.apiUrl, {
      params: { page, size },
      withCredentials: true,
    });
  }

  updateUser(id: number, data: UserAdminUpdateDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  getMe(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/me`, {
      withCredentials: true,
    });
  }
}
