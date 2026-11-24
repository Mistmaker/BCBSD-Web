import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { mensajeError, PdfService } from './pdf.service';

describe('PdfService', () => {
  let service: PdfService;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PdfService);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('descarga el PDF por HttpClient y lo muestra en la pestaña abierta', () => {
    const ventana = { location: { href: '' }, close: jasmine.createSpy('close') } as unknown as Window;
    spyOn(window, 'open').and.returnValue(ventana);

    service.abrir('http://api/reportes/orden.php?id=1');
    const req = backend.expectOne('http://api/reportes/orden.php?id=1');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['%PDF'], { type: 'application/pdf' }));

    expect(window.open).toHaveBeenCalledWith('', '_blank');
    expect(ventana.location.href).toMatch(/^blob:/);
  });

  it('cierra la pestaña si falla la descarga', () => {
    const ventana = { location: { href: '' }, close: jasmine.createSpy('close') } as unknown as Window;
    spyOn(window, 'open').and.returnValue(ventana);

    service.abrir('http://api/reportes/orden.php?id=1');
    backend.expectOne('http://api/reportes/orden.php?id=1').flush(new Blob(), { status: 401, statusText: 'Unauthorized' });

    expect(ventana.close).toHaveBeenCalled();
  });

  it('abrirPost envía los datos y resuelve al mostrar el PDF', async () => {
    const ventana = { location: { href: '' }, close: jasmine.createSpy('close') } as unknown as Window;
    spyOn(window, 'open').and.returnValue(ventana);

    const fin = service.abrirPost('http://api/reportes/informe.php', { desde: '2026-01-01' });
    const req = backend.expectOne('http://api/reportes/informe.php');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ desde: '2026-01-01' });
    req.flush(new Blob(['%PDF'], { type: 'application/pdf' }));
    await fin;
    expect(ventana.location.href).toMatch(/^blob:/);
  });

  it('lee el mensaje del API desde un error en Blob', async () => {
    const blob = new Blob([JSON.stringify({ msg: 'El gráfico "mes" no es una imagen PNG válida' })], { type: 'application/json' });
    expect(await mensajeError({ error: blob })).toContain('"mes"');
    expect(await mensajeError({ error: new Blob(['x']) })).toBe('');
    expect(await mensajeError({ message: 'Http failure' })).toBe('Http failure');
  });
});
