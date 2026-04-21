import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMatchResult } from './admin-match-result';

describe('AdminMatchResult', () => {
  let component: AdminMatchResult;
  let fixture: ComponentFixture<AdminMatchResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMatchResult],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMatchResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
