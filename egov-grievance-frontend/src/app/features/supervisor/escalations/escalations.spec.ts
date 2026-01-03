import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Escalations } from './escalations';

describe('Escalations', () => {
  let component: Escalations;
  let fixture: ComponentFixture<Escalations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Escalations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Escalations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
