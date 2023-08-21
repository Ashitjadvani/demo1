import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailPopupComponent } from './send-email-popup.component';

describe('SendEmailPopupComponent', () => {
  let component: SendEmailPopupComponent;
  let fixture: ComponentFixture<SendEmailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendEmailPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
