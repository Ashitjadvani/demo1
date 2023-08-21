import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementEditTemplateComponent } from './procurement-edit-template.component';

describe('ProcurementEditTemplateComponent', () => {
  let component: ProcurementEditTemplateComponent;
  let fixture: ComponentFixture<ProcurementEditTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementEditTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementEditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
