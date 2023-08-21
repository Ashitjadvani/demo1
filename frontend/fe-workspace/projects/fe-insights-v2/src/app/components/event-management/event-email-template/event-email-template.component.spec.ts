import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEmailTemplateComponent } from './event-email-template.component';

describe('EventEmailTemplateComponent', () => {
  let component: EventEmailTemplateComponent;
  let fixture: ComponentFixture<EventEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
