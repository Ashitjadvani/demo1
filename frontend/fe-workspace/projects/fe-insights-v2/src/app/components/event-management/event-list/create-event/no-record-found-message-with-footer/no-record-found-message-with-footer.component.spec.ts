import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRecordFoundMessgaeWithFooterComponent } from './no-record-found-message-with-footer.component';

describe('NoRecordFoundMessgaeWithFooterComponent', () => {
  let component: NoRecordFoundMessgaeWithFooterComponent;
  let fixture: ComponentFixture<NoRecordFoundMessgaeWithFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoRecordFoundMessgaeWithFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoRecordFoundMessgaeWithFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
