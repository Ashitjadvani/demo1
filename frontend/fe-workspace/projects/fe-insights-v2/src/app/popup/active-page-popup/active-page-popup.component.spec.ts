import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePagePopupComponent } from './active-page-popup.component';

describe('ActivePagePopupComponent', () => {
  let component: ActivePagePopupComponent;
  let fixture: ComponentFixture<ActivePagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivePagePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
