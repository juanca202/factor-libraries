import { TestBed } from '@angular/core/testing';

import { GoogleTagManagerService } from './google-tag-manager.service';

describe('GoogleTagManagerService', () => {
  let service: GoogleTagManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleTagManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
