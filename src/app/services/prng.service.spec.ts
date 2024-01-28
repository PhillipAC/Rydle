import { TestBed } from '@angular/core/testing';

import { PrngService } from './prng.service';

describe('PrngService', () => {
  let service: PrngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
