import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceGroupInfoComponent } from './resource-group-info.component';

describe('ResourceGroupInfoComponent', () => {
  let component: ResourceGroupInfoComponent;
  let fixture: ComponentFixture<ResourceGroupInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceGroupInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceGroupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
