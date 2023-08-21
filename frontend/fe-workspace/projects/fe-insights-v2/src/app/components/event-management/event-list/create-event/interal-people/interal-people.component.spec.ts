import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteralPeopleComponent } from './interal-people.component';

describe('InteralPeopleComponent', () => {
  let component: InteralPeopleComponent;
  let fixture: ComponentFixture<InteralPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteralPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteralPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
