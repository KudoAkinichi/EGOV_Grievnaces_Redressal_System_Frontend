import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceDetails } from './grievance-details';

describe('GrievanceDetails', () => {
  let component: GrievanceDetails;
  let fixture: ComponentFixture<GrievanceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievanceDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
