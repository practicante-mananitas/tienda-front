import { TestBed } from '@angular/core/testing';

import { AdminFinanzasService } from './admin-finanzas.service';

describe('AdminFinanzasService', () => {
  let service: AdminFinanzasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminFinanzasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
