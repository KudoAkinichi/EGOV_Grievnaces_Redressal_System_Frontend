import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfficer } from './create-officer';

describe('CreateOfficer', () => {
  let component: CreateOfficer;
  let fixture: ComponentFixture<CreateOfficer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOfficer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOfficer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
