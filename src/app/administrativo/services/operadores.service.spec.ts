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

  it('guarda siempre por POST multipart: datos en JSON y el PDF opcional', () => {
    const licencia = { fk_licencia_id: 1, conductor_licencia_emision: '2024-01-01', conductor_licencia_validez: '2029-01-01', conductor_estado: 'ACTIVO' };
    const pdf = new File(['%PDF-1.4'], 'licencia.pdf', { type: 'application/pdf' });
    service.guardar({ persona_doc_identidad: '1712345675', ...licencia }, pdf).subscribe();
    let req = http.expectOne(`${base}/setOperador.php`);
    expect(req.request.method).toBe('POST');
    const cuerpo = req.request.body as FormData;
    expect(JSON.parse(cuerpo.get('datos') as string).persona_doc_identidad).toBe('1712345675');
    expect((cuerpo.get('licencia_pdf') as File).name).toBe('licencia.pdf');
    req.flush({});
    service.guardar({ conductor_id: 3, ...licencia }).subscribe();
    req = http.expectOne(`${base}/setOperador.php`);
    expect(req.request.method).toBe('POST');
    expect((req.request.body as FormData).has('licencia_pdf')).toBeFalse();
    req.flush({});
  });

  it('URL del PDF de la licencia', () => {
    expect(service.urlLicencia(7)).toBe(`${base}/getLicenciaPdf.php?id=7`);
  });
});
