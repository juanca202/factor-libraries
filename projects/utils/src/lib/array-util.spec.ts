import { TestBed } from '@angular/core/testing';

import { ArrayUtil } from './array-util';

describe('ArrayUtil', () => {
  let service: ArrayUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrayUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
