import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserDTO, UserAdminUpdateDTO } from '../models/user.models';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ─── Création ─────────────────────────────────────────────────

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  // ─── getUsers ─────────────────────────────────────────────────

  it('getUsers() devrait appeler GET /users avec les params par défaut', () => {
    service.getUsers().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/users?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 });
  });

  it('getUsers() devrait appeler GET /users avec les params fournis', () => {
    service.getUsers(2, 5).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/users?page=2&size=5`);
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0, totalPages: 0, number: 2, size: 5 });
  });

  it('getUsers() devrait retourner une page de UserDTO', () => {
    const mockUsers: UserDTO[] = [
      { id: 1, pseudo: 'Nithog', role: 'ADMIN', active: true },
      { id: 2, pseudo: 'Coach1', role: 'USER', active: true },
    ];
    const mockPage = {
      content: mockUsers,
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 10,
    };

    service.getUsers().subscribe((page) => {
      expect(page.content.length).toBe(2);
      expect(page.content[0].pseudo).toBe('Nithog');
      expect(page.totalElements).toBe(2);
    });

    httpMock.expectOne(`${environment.apiUrl}/users?page=0&size=10`).flush(mockPage);
  });

  // ─── updateUser ───────────────────────────────────────────────

  it('updateUser() devrait appeler PUT /users/{id}', () => {
    const updateData: UserAdminUpdateDTO = { role: 'ADMIN', active: true };

    service.updateUser(1, updateData).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual(updateData);
    req.flush({ id: 1, pseudo: 'Nithog', role: 'ADMIN', active: true });
  });

  it('updateUser() devrait retourner le UserDTO mis à jour', () => {
    const updateData: UserAdminUpdateDTO = { role: 'ADMIN', active: true };
    const mockResponse: UserDTO = { id: 1, pseudo: 'Nithog', role: 'ADMIN', active: true };

    service.updateUser(1, updateData).subscribe((user) => {
      expect(user.role).toBe('ADMIN');
      expect(user.active).toBe(true);
    });

    httpMock.expectOne(`${environment.apiUrl}/users/1`).flush(mockResponse);
  });

  // ─── getMe ────────────────────────────────────────────────────

  it('getMe() devrait appeler GET /users/me', () => {
    service.getMe().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: 1, pseudo: 'Nithog', role: 'USER', active: true });
  });

  it("getMe() devrait retourner le UserDTO de l'utilisateur connecté", () => {
    const mockUser: UserDTO = { id: 1, pseudo: 'Nithog', role: 'USER', active: true };

    service.getMe().subscribe((user) => {
      expect(user.pseudo).toBe('Nithog');
      expect(user.id).toBe(1);
    });

    httpMock.expectOne(`${environment.apiUrl}/users/me`).flush(mockUser);
  });
});
