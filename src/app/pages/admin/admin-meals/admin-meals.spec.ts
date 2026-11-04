import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AdminMeals } from './admin-meals';

describe('AdminMeals', () => {
  let component: AdminMeals;
  let fixture: ComponentFixture<AdminMeals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMeals],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMeals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
