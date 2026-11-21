import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DistributivoService } from './distributivo.service';

describe('DistributivoService', () => {
  let service: DistributivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(DistributivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
