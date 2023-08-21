import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalListRowsComponent } from './external-list-rows.component';

describe('ExternalListRowsComponent', () => {
  let component: ExternalListRowsComponent;
  let fixture: ComponentFixture<ExternalListRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalListRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalListRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
