import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCostCenterTypeComponent } from './add-cost-center-type.component';

describe('AddCostCenterTypeComponent', () => {
  let component: AddCostCenterTypeComponent;
  let fixture: ComponentFixture<AddCostCenterTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCostCenterTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCostCenterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
