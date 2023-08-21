import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStepComponent } from './service-step.component';

describe('ServiceStepComponent', () => {
  let component: ServiceStepComponent;
  let fixture: ComponentFixture<ServiceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
