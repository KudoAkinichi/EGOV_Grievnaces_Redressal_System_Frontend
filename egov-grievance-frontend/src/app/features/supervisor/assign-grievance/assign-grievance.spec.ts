import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGrievance } from './assign-grievance';

describe('AssignGrievance', () => {
  let component: AssignGrievance;
  let fixture: ComponentFixture<AssignGrievance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignGrievance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignGrievance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
