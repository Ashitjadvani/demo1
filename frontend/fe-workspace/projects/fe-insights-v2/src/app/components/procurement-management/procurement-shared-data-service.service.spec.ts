import { TestBed } from '@angular/core/testing';

import { ProcurementSharedDataServiceService } from './procurement-shared-data-service.service';

describe('ProcurementSharedDataServiceService', () => {
  let service: ProcurementSharedDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcurementSharedDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
