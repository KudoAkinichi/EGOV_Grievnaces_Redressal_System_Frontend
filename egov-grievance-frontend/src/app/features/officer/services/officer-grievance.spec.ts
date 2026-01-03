import { TestBed } from '@angular/core/testing';

import { OfficerGrievance } from './officer-grievance';

describe('OfficerGrievance', () => {
  let service: OfficerGrievance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficerGrievance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
