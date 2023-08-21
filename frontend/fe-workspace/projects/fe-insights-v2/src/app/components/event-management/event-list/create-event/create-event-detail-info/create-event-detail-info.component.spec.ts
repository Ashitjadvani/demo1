import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventDetailInfoComponent } from './create-event-detail-info.component';

describe('CreateEventDetailInfoComponent', () => {
  let component: CreateEventDetailInfoComponent;
  let fixture: ComponentFixture<CreateEventDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEventDetailInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
