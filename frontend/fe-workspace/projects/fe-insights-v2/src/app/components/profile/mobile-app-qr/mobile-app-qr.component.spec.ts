import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAppQrComponent } from './mobile-app-qr.component';

describe('MobileAppQrComponent', () => {
  let component: MobileAppQrComponent;
  let fixture: ComponentFixture<MobileAppQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileAppQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
