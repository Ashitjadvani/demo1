import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointStepComponent } from './checkpoint-step.component';

describe('CheckpointStepComponent', () => {
  let component: CheckpointStepComponent;
  let fixture: ComponentFixture<CheckpointStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckpointStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckpointStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
