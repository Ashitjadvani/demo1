import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManagementSecretCodeComponent } from './event-management-secret-code.component';

describe('EventManagementSecretCodeComponent', () => {
  let component: EventManagementSecretCodeComponent;
  let fixture: ComponentFixture<EventManagementSecretCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventManagementSecretCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventManagementSecretCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
