import { TestBed } from '@angular/core/testing';

import { CoachResultService } from './coach-result.service';

describe('CoachResultService', () => {
  let service: CoachResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
