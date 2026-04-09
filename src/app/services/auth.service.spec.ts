import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponseDTO } from '../models/auth.models';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  // Après chaque test — vérifie qu'il ne reste pas de requêtes en suspens
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isAuthenticated devrait être false par défaut', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('isAdmin devrait être false par défaut', () => {
    expect(service.isAdmin()).toBe(false);
  });

  it('pseudo devrait être null par défaut', () => {
    expect(service.pseudo()).toBeNull();
  });

  // ─── Tests login ──────────────────────────────────────────────

  it('login() devrait appeler POST /auth/login', () => {
    const mockResponse: AuthResponseDTO = { pseudo: 'Nithog', role: 'PLAYER' };

    service.login({ email: 'nithog@test.com', password: '123' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });

  it('login() devrait mettre à jour le signal currentUser', () => {
    const mockResponse: AuthResponseDTO = { pseudo: 'Nithog', role: 'PLAYER' };

    service.login({ email: 'nithog@test.com', password: '123' }).subscribe();

    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.pseudo()).toBe('Nithog');
    expect(service.isAdmin()).toBe(false);
  });

  it('login() devrait mettre isAdmin à true pour un ADMIN', () => {
    const mockResponse: AuthResponseDTO = { pseudo: 'Admin', role: 'ADMIN' };

    service.login({ email: 'admin@test.com', password: '123' }).subscribe();

    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);

    expect(service.isAdmin()).toBe(true);
  });

  // ─── Tests register ───────────────────────────────────────────

  it('register() devrait appeler POST /auth/register', () => {
    service
      .register({
        email: 'new@test.com',
        pseudo: 'NewUser',
        password: '123',
      })
      .subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush(null);
  });

  // ─── Tests logout ─────────────────────────────────────────────

  it('logout() devrait vider le signal currentUser', () => {
    // D'abord on connecte un utilisateur
    const mockResponse: AuthResponseDTO = { pseudo: 'Nithog', role: 'PLAYER' };
    service.login({ email: 'nithog@test.com', password: '123' }).subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    expect(service.isAuthenticated()).toBe(true); // vérification intermédiaire

    // Puis on déconnecte
    service.logout().subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/logout`).flush(null);

    expect(service.isAuthenticated()).toBe(false);
    expect(service.pseudo()).toBeNull();
  });
});
