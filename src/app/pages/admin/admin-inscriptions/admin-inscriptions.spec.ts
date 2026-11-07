import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AdminInscriptions } from './admin-inscriptions';

describe('AdminInscriptions', () => {
  let component: AdminInscriptions;
  let fixture: ComponentFixture<AdminInscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInscriptions],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInscriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
