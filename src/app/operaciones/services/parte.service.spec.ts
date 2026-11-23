import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ParteService } from './parte.service';

describe('ParteService', () => {
  it('envía solo los filtros con valor y anula con motivo', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(ParteService);
    const http = TestBed.inject(HttpTestingController);
    service.getAll({ desde: '2026-01-01', estacion: null, tipo: '', q: 'tala' }).subscribe();
    const req = http.expectOne(r => r.url.endsWith('/servicios/operaciones/getPartes.php'));
    expect(req.request.params.keys()).toEqual(['desde', 'q']);
    req.flush([]);
    service.anular(5, 'Duplicado').subscribe();
    const put = http.expectOne(r => r.url.endsWith('/setParte.php'));
    expect(put.request.method).toBe('PUT');
    expect(put.request.body).toEqual({ parte_id: 5, parte_estado: 'ANULADO', parte_anulado_motivo: 'Duplicado' });
    put.flush({ msg: 'ok' });
    http.verify();
  });
});
