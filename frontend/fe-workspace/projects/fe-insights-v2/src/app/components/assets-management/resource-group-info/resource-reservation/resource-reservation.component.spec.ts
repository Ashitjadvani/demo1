import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceReservationComponent } from './resource-reservation.component';

describe('ResourceReservationComponent', () => {
  let component: ResourceReservationComponent;
  let fixture: ComponentFixture<ResourceReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceReservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
