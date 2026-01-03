import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveGrievance } from './resolve-grievance';

describe('ResolveGrievance', () => {
  let component: ResolveGrievance;
  let fixture: ComponentFixture<ResolveGrievance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveGrievance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolveGrievance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
