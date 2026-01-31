import { TestBed } from '@angular/core/testing';

import { IntervencionesService } from './intervenciones.service';

describe('IntervencionesService', () => {
  let service: IntervencionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervencionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
