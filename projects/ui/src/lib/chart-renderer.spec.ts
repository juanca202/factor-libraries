import { TestBed } from '@angular/core/testing';

import { ChartRenderer } from './chart-renderer';

describe('ChartRenderer', () => {
  let service: ChartRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
