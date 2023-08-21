import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderEventDetailsComponent } from './event-details.component';

describe('EventDetailsComponent', () => {
  let component: CalenderEventDetailsComponent;
  let fixture: ComponentFixture<CalenderEventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderEventDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
