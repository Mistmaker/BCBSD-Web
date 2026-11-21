import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { OrdenMantenimientoFormComponent, aFechaHoraLocal, ahoraLocal } from './orden-mantenimiento-form.component';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { PersonalService } from '../../../tthh/services/personal.service';
import { ConfiguracionMantenimiento, EstadoVehiculoModel, OrdenMantenimientoModel } from '../../models/mantenimiento.model';

const configuracion: ConfiguracionMantenimiento = {
  sistema_nombre: 'CB', sistema_siglas: 'CBSD',
  parametros: [
    { param_key: 'MANT_RUBROS', param_value: 'MANO DE OBRA|REPUESTOS|ACEITES Y LUBRICANTES', param_name: '' },
    { param_key: 'MANT_CARGOS_RESPONSABLE', param_value: 'ADMINISTRADOR DE LA ORDEN DE COMPRA|PROFESIONAL TÉCNICO', param_name: '' },
  ],
  director_administrativo: { ppersonal_id: 44, nombre_completo: 'DIRECTOR' },
};

const estado: EstadoVehiculoModel = {
  vehiculo_id: 7, vehiculo_sigla: 'B-7', vehiculo_placa: 'PEA-7', vehiculo_marca: 'HINO', vehiculo_modelo: '500', vehiculo_tipo: 'CAMION',
  fk_plan_id: 1, plan_modelo: 'HINO 500', vehiculo_kilometraje: 31500, ultimo_km_mantenimiento: 25000, ultimo_fecha_mantenimiento: '2026-01-10',
  ultimo_km_preventivo: 25000, ordenes_abiertas: 0, tolerancia_km: 1000,
  proximo: { mantenimiento_id: 1, km_intervalo: 10000, km_proximo: 35000, km_restante: 3500, estado: 'AL DIA' }, estado_mantenimiento: 'AL DIA',
};

describe('OrdenMantenimientoFormComponent', () => {
  let mant: jasmine.SpyObj<MantenimientoService>;
  let fixture: ComponentFixture<OrdenMantenimientoFormComponent>;

  function crear(id: string, query: Record<string, string> = {}) {
    TestBed.configureTestingModule({
      imports: [OrdenMantenimientoFormComponent],
      providers: [
        provideRouter([]),
        { provide: MantenimientoService, useValue: mant },
        { provide: PersonalService, useValue: { getAll: () => of([]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }), queryParamMap: convertToParamMap(query) } } },
      ]
    });
    fixture = TestBed.createComponent(OrdenMantenimientoFormComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(() => {
    mant = jasmine.createSpyObj<MantenimientoService>('MantenimientoService',
      ['getEstadoVehiculos', 'getEstadoVehiculo', 'getOrden', 'guardarOrden', 'getConfiguracion', 'getSiguienteNumeroInforme']);
    mant.getConfiguracion.and.returnValue(of(configuracion));
    mant.getEstadoVehiculos.and.returnValue(of([estado]));
    mant.getEstadoVehiculo.and.returnValue(of(estado));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
  });

  it('convierte fechas para el input datetime-local', () => {
    expect(aFechaHoraLocal('2026-11-20 09:30:00')).toBe('2026-11-20T09:30');
    expect(aFechaHoraLocal(null)).toBe('');
    expect(ahoraLocal(new Date(2026, 0, 2, 3, 4))).toBe('2026-01-02T03:04');
  });

  it('orden nueva desde la flota: precarga vehículo, tipo y km actual', () => {
    const c = crear('nuevo', { vehiculo: '7', tipo: 'PREVENTIVO' });
    expect(c.esNueva).toBeTrue();
    expect(c.orden.fk_vehiculo_id).toBe(7);
    expect(c.orden.orden_tipomantenimiento).toBe('PREVENTIVO');
    expect(c.orden.orden_km_mantenimiento).toBe(31500);
    expect(c.estadoVehiculo?.plan_modelo).toBe('HINO 500');
    expect(c.orden.orden_fecha_mantenimiento).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('orden nueva: precarga el director vigente y el primer cargo configurado', () => {
    const c = crear('nuevo');
    expect(c.orden.director_administrativo).toBe(44);
    expect(c.orden.tecnico_puesto).toBe('ADMINISTRADOR DE LA ORDEN DE COMPRA');
    expect(c.pestana).toBe('registro');
  });

  it('desglose por rubro: sugiere rubros no usados y totaliza', () => {
    const c = crear('nuevo');
    c.agregarFactura();
    c.agregarFactura();
    c.agregarFactura();
    expect(c.orden.facturas.map(f => f.factura_tipo)).toEqual(['MANO DE OBRA', 'REPUESTOS', 'ACEITES Y LUBRICANTES']);
    c.orden.facturas[0].factura_valor = 51.1;
    c.orden.facturas[1].factura_valor = '415';
    expect(c.totalesRubro).toEqual([{ rubro: 'MANO DE OBRA', total: 51.1 }, { rubro: 'REPUESTOS', total: 415 }]);
    expect(c.totalFacturas).toBeCloseTo(466.1);
  });

  it('botón +1 completa el número y la fecha del informe', () => {
    mant.getSiguienteNumeroInforme.and.returnValue(of({ informe_numero: 'CBSD26INF00007', informe_serie: 7 }));
    const c = crear('nuevo');
    c.siguienteInforme();
    expect(c.orden.informe_numero).toBe('CBSD26INF00007');
    expect(c.orden.informe_fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('si faltan datos obligatorios vuelve a la pestaña de registro', () => {
    const c = crear('nuevo');
    c.pestana = 'pago';
    c.guardar({ invalid: true } as any);
    expect(c.camposFaltantes()).toContain('unidad');
    expect(c.pestana).toBe('registro');
  });

  it('conserva rubros y cargos antiguos que no están en la configuración', () => {
    mant.getOrden.and.returnValue(of(Object.assign(new OrdenMantenimientoModel(), {
      orden_id: 3, fk_vehiculo_id: 7, tecnico_puesto: 'CARGO ANTIGUO', facturas: [{ factura_tipo: 'FACTURA', factura_valor: 10 }],
    })));
    const c = crear('3');
    expect(c.cargos).toContain('CARGO ANTIGUO');
    expect(c.rubros).toContain('FACTURA');
  });

  it('advierte si el km es menor al último mantenimiento', () => {
    const c = crear('nuevo', { vehiculo: '7' });
    c.orden.orden_km_mantenimiento = 20000;
    expect(c.advertenciaKm).toContain('menor');
    c.orden.orden_km_mantenimiento = 26000;
    expect(c.advertenciaKm).toBeNull();
  });

  it('carga una orden existente sin sobrescribir su km', () => {
    mant.getOrden.and.returnValue(of(Object.assign(new OrdenMantenimientoModel(), {
      orden_id: 3, orden_codigo: 'CBSD26MAN00003', fk_vehiculo_id: 7, orden_km_mantenimiento: '28000.00' as any,
      orden_fecha_mantenimiento: '2026-11-20 09:30:00', orden_estado: 'MANTENIMIENTO',
      facturas: [{ factura_tipo: 'MANO DE OBRA', factura_valor: '10.50' }, { factura_tipo: 'REPUESTOS', factura_valor: null }],
    })));
    const c = crear('3');
    expect(mant.getOrden).toHaveBeenCalledWith(3);
    expect(c.esNueva).toBeFalse();
    expect(c.orden.orden_km_mantenimiento).toBe(28000);
    expect(c.orden.orden_fecha_mantenimiento).toBe('2026-11-20T09:30');
    expect(c.totalFacturas).toBe(10.5);
  });

  it('una orden anulada es de solo lectura', () => {
    mant.getOrden.and.returnValue(of(Object.assign(new OrdenMantenimientoModel(), { orden_id: 3, orden_estado: 'ANULADA', fk_vehiculo_id: 7 })));
    const c = crear('3');
    expect(c.soloLectura).toBeTrue();
  });

  it('guarda con el nuevo estado y vuelve al listado', async () => {
    mant.guardarOrden.and.returnValue(of({ msg: 'Orden de mantenimiento actualizada', id: 3 }));
    const c = crear('nuevo', { vehiculo: '7' });
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    c.guardar({ invalid: false } as any, 'FINALIZADA');
    expect(mant.guardarOrden.calls.mostRecent().args[0].orden_estado).toBe('FINALIZADA');
    expect(c.orden.orden_estado).toBe('MANTENIMIENTO', 'el modelo local no cambia hasta guardar');
    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/ordenes-mantenimiento']);
  });

  it('no guarda si el formulario es inválido', () => {
    const c = crear('nuevo');
    c.guardar({ invalid: true } as any);
    expect(mant.guardarOrden).not.toHaveBeenCalled();
    expect(c.validado).toBeTrue();
  });

  it('agrega y quita filas de detalle', () => {
    const c = crear('nuevo');
    c.agregarTrabajo(c.orden.trabajos);
    c.agregarFactura();
    c.agregarAnexo();
    expect(c.orden.trabajos.length).toBe(1);
    expect(c.orden.facturas[0].factura_tipo).toBe('MANO DE OBRA');
    c.quitar(c.orden.trabajos, 0);
    expect(c.orden.trabajos.length).toBe(0);
  });
});
