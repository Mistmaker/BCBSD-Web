import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ParteService } from './parte.service';

describe('ParteService', () => {
  let service: ParteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ParteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
