import { TestBed } from '@angular/core/testing';

import { HojaRutaService } from './hoja-ruta.service';

describe('HojaRutaService', () => {
  let service: HojaRutaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HojaRutaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
