import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AdminMenus } from './admin-menus';

describe('AdminMenus', () => {
  let component: AdminMenus;
  let fixture: ComponentFixture<AdminMenus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMenus],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMenus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
