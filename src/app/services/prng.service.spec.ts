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

  it('should generate a new value each time', () => {
    let value1 = service.next();
    let value2 = service.next();
    expect(value1).not.toEqual(value2);
  });

  it('should be able to reseed', () => {
    let state1 = service.state;
    service.reseed(1234);
    let state2 = service.state;
    expect(state1).not.toEqual(state2);
  });
  
  it('should be able to reseed randomly', () => {
    let state1 = service.state;
    service.reseedRandom();
    let state2 = service.state;
    expect(state1).not.toEqual(state2);
  });
});
