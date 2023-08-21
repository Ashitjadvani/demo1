import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueStepComponent } from './venue-step.component';

describe('VenueStepComponent', () => {
  let component: VenueStepComponent;
  let fixture: ComponentFixture<VenueStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenueStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
