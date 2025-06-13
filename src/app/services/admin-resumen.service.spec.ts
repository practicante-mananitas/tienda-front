import { TestBed } from '@angular/core/testing';

import { AdminResumenService } from './admin-resumen.service';

describe('AdminResumenService', () => {
  let service: AdminResumenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminResumenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
