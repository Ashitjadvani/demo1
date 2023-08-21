import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullcalenderViewComponent } from './fullcalender-view.component';

describe('FullcalenderViewComponent', () => {
  let component: FullcalenderViewComponent;
  let fixture: ComponentFixture<FullcalenderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullcalenderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullcalenderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
