import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCollapseExpandRowComponent } from './event-collapse-expand-row.component';

describe('EventCollapseExpandRowComponent', () => {
  let component: EventCollapseExpandRowComponent;
  let fixture: ComponentFixture<EventCollapseExpandRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCollapseExpandRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCollapseExpandRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
