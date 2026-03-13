import { TestBed } from '@angular/core/testing';

import { CsvExporter } from './csv-exporter';

describe('CsvExporter', () => {
  let service: CsvExporter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvExporter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
