import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookResourcePopupComponent } from './book-resource-popup.component';

describe('BookResourcePopupComponent', () => {
  let component: BookResourcePopupComponent;
  let fixture: ComponentFixture<BookResourcePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookResourcePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookResourcePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
