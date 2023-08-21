import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceStepComponent } from './resource-step.component';

describe('ResourceStepComponent', () => {
  let component: ResourceStepComponent;
  let fixture: ComponentFixture<ResourceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
