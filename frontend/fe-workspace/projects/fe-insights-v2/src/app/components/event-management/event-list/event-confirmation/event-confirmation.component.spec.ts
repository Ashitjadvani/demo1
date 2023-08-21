import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfirmationComponent } from './event-confirmation.component';

describe('EventConfirmationComponent', () => {
  let component: EventConfirmationComponent;
  let fixture: ComponentFixture<EventConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
