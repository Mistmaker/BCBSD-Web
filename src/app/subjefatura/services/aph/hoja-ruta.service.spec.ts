import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { HojaRutaService } from './hoja-ruta.service';

describe('HojaRutaService', () => {
  let service: HojaRutaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(HojaRutaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
