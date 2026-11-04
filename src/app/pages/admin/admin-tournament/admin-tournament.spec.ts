import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AdminTournament } from './admin-tournament';

describe('AdminTournament', () => {
  let component: AdminTournament;
  let fixture: ComponentFixture<AdminTournament>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTournament],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTournament);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
