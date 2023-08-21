import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmcComponent } from './login.component';

describe('EmcComponent', () => {
  let component: EmcComponent;
  let fixture: ComponentFixture<EmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
