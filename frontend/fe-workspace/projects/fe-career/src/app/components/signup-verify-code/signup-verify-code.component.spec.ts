import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVerifyCodeComponent } from './signup-verify-code.component';

describe('SignupVerifyCodeComponent', () => {
  let component: SignupVerifyCodeComponent;
  let fixture: ComponentFixture<SignupVerifyCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupVerifyCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVerifyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
