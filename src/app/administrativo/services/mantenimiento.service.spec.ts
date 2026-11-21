import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MantenimientoService } from './mantenimiento.service';
import { InformeMantenimientoModel, OrdenMantenimientoModel, PlanMantenimientoModel, RecursoMantenimientoModel } from '../models/mantenimiento.model';
import { environment } from '../../../environments/environment';

describe('MantenimientoService', () => {
  let service: MantenimientoService;
  let http: HttpTestingController;
  const base = `${environment.API_URL}/servicios/administrativo/mantenimiento`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(MantenimientoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta el estado de la flota y de un vehículo', () => {
    service.getEstadoVehiculos().subscribe();
    http.expectOne(`${base}/getEstadoVehiculos.php`).flush([]);
    service.getEstadoVehiculo(7).subscribe();
    http.expectOne(`${base}/getEstadoVehiculos.php?id=7`).flush({});
  });

  it('filtra órdenes por vehículo y sin informe', () => {
    service.getOrdenes({ vehiculo_id: 3, sin_informe: true }).subscribe();
    http.expectOne(`${base}/getOrdenesMantenimiento.php?vehiculo_id=3&sin_informe=1`).flush([]);
    service.getOrdenes().subscribe();
    http.expectOne(`${base}/getOrdenesMantenimiento.php`).flush([]);
  });

  it('crea con POST y actualiza con PUT', () => {
    service.guardarOrden(new OrdenMantenimientoModel()).subscribe();
    expect(http.expectOne(`${base}/setOrdenMantenimiento.php`).request.method).toBe('POST');

    service.guardarOrden(Object.assign(new OrdenMantenimientoModel(), { orden_id: 1, vehiculo_sigla: 'B-1' })).subscribe();
    const put = http.expectOne(`${base}/setOrdenMantenimiento.php`);
    expect(put.request.method).toBe('PUT');
    expect(put.request.body.vehiculo_sigla).toBeUndefined();

    service.guardarInforme(Object.assign(new InformeMantenimientoModel(), { informe_id: 2, ordenes_detalle: [], ordenes: [5] })).subscribe();
    const inf = http.expectOne(`${base}/setInformeMantenimiento.php`);
    expect(inf.request.method).toBe('PUT');
    expect(inf.request.body.ordenes_detalle).toBeUndefined();
    expect(inf.request.body.ordenes).toEqual([5]);

    service.guardarPlan(new PlanMantenimientoModel()).subscribe();
    expect(http.expectOne(`${base}/setPlan.php`).request.method).toBe('POST');

    service.guardarRecurso(Object.assign(new RecursoMantenimientoModel(), { recurso_id: 4 })).subscribe();
    expect(http.expectOne(`${base}/setRecurso.php`).request.method).toBe('PUT');
  });
});
