import { TestBed } from '@angular/core/testing';

import { ObserveIntersecting } from './observe-intersecting';

describe('ObserveIntersecting', () => {
  let service: ObserveIntersecting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObserveIntersecting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
