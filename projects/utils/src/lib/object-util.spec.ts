import { TestBed } from '@angular/core/testing';

import { ObjectUtil } from './object-util';

describe('ObjectUtil', () => {
  let service: ObjectUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
