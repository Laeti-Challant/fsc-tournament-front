import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRules } from './admin-rules';

describe('AdminRules', () => {
  let component: AdminRules;
  let fixture: ComponentFixture<AdminRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRules],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
