import { TestBed } from '@angular/core/testing';

import { GoogleTagManager } from './google-tag-manager';

describe('GoogleTagManager', () => {
  let service: GoogleTagManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleTagManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
