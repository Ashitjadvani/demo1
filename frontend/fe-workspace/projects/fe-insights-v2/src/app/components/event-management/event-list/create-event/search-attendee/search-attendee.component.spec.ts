import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAttendeeComponent } from './search-attendee.component';

describe('SearchAttendeeComponent', () => {
  let component: SearchAttendeeComponent;
  let fixture: ComponentFixture<SearchAttendeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAttendeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
