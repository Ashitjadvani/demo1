import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditResourcetypeComponent } from './add-edit-resourcetype.component';

describe('AddEditResourcetypeComponent', () => {
  let component: AddEditResourcetypeComponent;
  let fixture: ComponentFixture<AddEditResourcetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditResourcetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditResourcetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
