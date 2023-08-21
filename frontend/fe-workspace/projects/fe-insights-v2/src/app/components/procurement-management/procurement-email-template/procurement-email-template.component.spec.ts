import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementEmailTemplateComponent } from './procurement-email-template.component';

describe('ProcurementEmailTemplateComponent', () => {
  let component: ProcurementEmailTemplateComponent;
  let fixture: ComponentFixture<ProcurementEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
