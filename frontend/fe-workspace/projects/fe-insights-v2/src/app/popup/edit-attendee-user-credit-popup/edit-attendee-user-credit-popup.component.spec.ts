import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttendeeUserCreditPopupComponent } from './edit-attendee-user-credit-popup.component';

describe('EditAttendeeUserCreditPopupComponent', () => {
  let component: EditAttendeeUserCreditPopupComponent;
  let fixture: ComponentFixture<EditAttendeeUserCreditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAttendeeUserCreditPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttendeeUserCreditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
