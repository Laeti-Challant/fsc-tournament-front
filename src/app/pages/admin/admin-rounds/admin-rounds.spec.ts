import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRounds } from './admin-rounds';

describe('AdminRounds', () => {
  let component: AdminRounds;
  let fixture: ComponentFixture<AdminRounds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRounds],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRounds);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
