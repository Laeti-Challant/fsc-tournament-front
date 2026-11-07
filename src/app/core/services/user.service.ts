import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {
  UserAdminUpdateDTO,
  UserDTO,
  Page,
  UserUpdatePasswordDTO,
  UserUpdatePseudoDTO,
  UserUpdateEmailDTO,
} from '../models/user.models';

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

  updateEmail(data: UserUpdateEmailDTO): Observable<UserDTO> {
    const { confirmPassword, ...payload } = data;
    return this.http.put<UserDTO>(`${this.apiUrl}/me/email`, payload, {
      withCredentials: true,
    });
  }

  updatePseudo(data: UserUpdatePseudoDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/me/pseudo`, data, {
      withCredentials: true,
    });
  }

  updatePassword(data: UserUpdatePasswordDTO): Observable<UserDTO> {
    const { confirmPassword, ...payload } = data; // on retire confirmPassword
    return this.http.put<UserDTO>(`${this.apiUrl}/me/password`, payload, {
      withCredentials: true,
    });
  }
}
