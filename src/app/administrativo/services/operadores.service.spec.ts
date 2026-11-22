import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OperadoresService } from './operadores.service';
import { environment } from '../../../environments/environment';

describe('OperadoresService', () => {
  let service: OperadoresService;
  let http: HttpTestingController;
  const base = `${environment.API_URL}/servicios/administrativo/operadores`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(OperadoresService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta listado, uno, catálogos y cédula', () => {
    service.getOperadores().subscribe();
    http.expectOne(`${base}/getOperadores.php`).flush([]);
    service.getOperador(4).subscribe();
    http.expectOne(`${base}/getOperadores.php?id=4`).flush({});
    service.getCatalogos().subscribe();
    http.expectOne(`${base}/getCatalogosOperador.php`).flush({});
    service.buscarPorCedula('1712345675').subscribe();
    http.expectOne(`${base}/getPersonaOperador.php?cedula=1712345675`).flush({});
  });

  it('POST para crear y PUT para editar la licencia', () => {
    const licencia = { fk_licencia_id: 1, conductor_licencia_emision: '2024-01-01', conductor_licencia_validez: '2029-01-01', conductor_estado: 'ACTIVO' };
    service.guardar({ persona_doc_identidad: '1712345675', ...licencia }).subscribe();
    expect(http.expectOne(`${base}/setOperador.php`).request.method).toBe('POST');
    service.guardar({ conductor_id: 3, ...licencia }).subscribe();
    expect(http.expectOne(`${base}/setOperador.php`).request.method).toBe('PUT');
  });
});
