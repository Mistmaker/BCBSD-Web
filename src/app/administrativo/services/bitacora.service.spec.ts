import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BitacoraService } from './bitacora.service';
import { environment } from '../../../environments/environment';

describe('BitacoraService', () => {
  let service: BitacoraService;
  let http: HttpTestingController;
  const base = `${environment.API_URL}/servicios/administrativo/bitacora`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(BitacoraService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta la flota y un vehículo con el rango de fechas', () => {
    service.getFlota('2026-01-01', '2026-06-30').subscribe();
    http.expectOne(`${base}/getBitacoraFlota.php?desde=2026-01-01&hasta=2026-06-30`).flush({ vehiculos: [] });
    service.getVehiculo(9, '2026-01-01', '2026-06-30').subscribe();
    http.expectOne(`${base}/getBitacoraVehiculo.php?id=9&desde=2026-01-01&hasta=2026-06-30`).flush({});
  });
});
