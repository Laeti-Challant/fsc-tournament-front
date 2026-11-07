import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AdminRoundDetail } from './admin-round-detail';

describe('AdminRoundDetail', () => {
  let component: AdminRoundDetail;
  let fixture: ComponentFixture<AdminRoundDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoundDetail],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRoundDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
