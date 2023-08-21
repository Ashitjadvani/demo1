import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelActionComponent } from './wheel-action.component';

describe('WheelActionComponent', () => {
  let component: WheelActionComponent;
  let fixture: ComponentFixture<WheelActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WheelActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WheelActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
