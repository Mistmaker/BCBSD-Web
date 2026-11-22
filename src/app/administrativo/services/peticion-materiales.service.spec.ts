import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PeticionMaterialesService } from './peticion-materiales.service';
import { environment } from '../../../environments/environment';

describe('PeticionMaterialesService', () => {
  let service: PeticionMaterialesService;
  let http: HttpTestingController;
  const url = `${environment.API_URL}/servicios/administrativo/serv-generales`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PeticionMaterialesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta por año, una, configuración y PDF', () => {
    service.getAll(2026).subscribe();
    http.expectOne(`${url}/getPeticionesMateriales.php?anio=2026`).flush([]);
    service.getAll(null).subscribe();
    http.expectOne(`${url}/getPeticionesMateriales.php`).flush([]);
    service.getById(4).subscribe();
    http.expectOne(`${url}/getPeticionesMateriales.php?id=4`).flush({});
    service.getConfig().subscribe();
    http.expectOne(`${url}/getPeticionesMateriales.php?config=1`).flush({});
    expect(service.urlPdf(4)).toBe(`${environment.API_URL}/reportes/servicios-generales/peticionMateriales.php?id=4`);
  });

  it('POST crea, PUT edita y anula con motivo', () => {
    const p = { peticion_fecha: '2026-11-22', peticion_lugar: '', peticion_destino: 'X', peticion_autorizado_para: null, solicitante_id: 1,
                solicitante_cargo: '', autoriza_id: null, autoriza_cargo: '', peticion_observaciones: '', detalle: [] };
    service.guardar(p).subscribe();
    expect(http.expectOne(`${url}/setPeticionMateriales.php`).request.method).toBe('POST');
    service.guardar({ ...p, peticion_id: 4 }).subscribe();
    expect(http.expectOne(`${url}/setPeticionMateriales.php`).request.method).toBe('PUT');
    service.anular(4, 'Duplicada').subscribe();
    expect(http.expectOne(`${url}/setPeticionMateriales.php`).request.body).toEqual({ peticion_id: 4, peticion_estado: 'ANULADA', peticion_observaciones: 'Duplicada' });
  });
});
