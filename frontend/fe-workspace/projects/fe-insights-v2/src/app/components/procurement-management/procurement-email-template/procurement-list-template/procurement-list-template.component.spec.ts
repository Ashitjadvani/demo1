import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementListTemplateComponent } from './procurement-list-template.component';

describe('ProcurementListTemplateComponent', () => {
  let component: ProcurementListTemplateComponent;
  let fixture: ComponentFixture<ProcurementListTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementListTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementListTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
