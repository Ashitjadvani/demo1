import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMoreDetailDialogComponent } from './request-more-detail-dialog.component';

describe('RequestMoreDetailDialogComponent', () => {
  let component: RequestMoreDetailDialogComponent;
  let fixture: ComponentFixture<RequestMoreDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestMoreDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMoreDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
