import { TestBed } from '@angular/core/testing';

import { ColorUtil } from './color-util';

describe('ColorUtil', () => {
  let service: ColorUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
