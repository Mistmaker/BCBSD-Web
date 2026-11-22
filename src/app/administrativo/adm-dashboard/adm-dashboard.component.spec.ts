import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ResumenGerencialService } from '../services/resumen-gerencial.service';
import { AdmDashboardComponent } from './adm-dashboard.component';

describe('AdmDashboardComponent', () => {
  const resumen = {
    mes: '2026-11',
    flota: { activos: 10, en_taller: 3, en_salida: 1, mantenimiento_vencido: 1, mantenimiento_proximo: 1, sin_plan: 7,
             atencion: [{ vehiculo_id: 1, vehiculo_sigla: 'B-1', vehiculo_placa: 'P-1', estado: 'VENCIDO', km_actual: 15000, km_proximo: 15000 }] },
    gasto: { mes: { combustible: 300, galones: 100, mantenimiento: 900, ordenes_mantenimiento: 2, movilizaciones: 4 },
             anio: { combustible: 4000, mantenimiento: 5000, por_rubro: [{ rubro: 'REPUESTOS', total: 3000 }] },
             meses: [{ mes: '2026-10', combustible: 500, galones: 150, mantenimiento: 500, ordenes_mantenimiento: 1, movilizaciones: 3 },
                     { mes: '2026-11', combustible: 300, galones: 100, mantenimiento: 900, ordenes_mantenimiento: 2, movilizaciones: 4 }] },
    contratos: [{ contrato_id: 1, contrato_codigo: 'C-1', contrato_taller: 'T', contrato_fecha_fin: '2026-12-31', asignado: 3000, consumido: 2850, saldo: 150 }],
    alertas: { vehiculos: 1, detalle: [{ vehiculo_id: 2, vehiculo_sigla: 'CAM-01', vehiculo_placa: 'P-2', alertas: ['TRABAJO_REPETIDO'], costo_total: 2000 }] },
    licencias: { VIGENTE: 5, 'POR VENCER': 1, VENCIDA: 2 },
    peticiones: { mes: 3, anio: 20 },
  };

  it('muestra las cifras principales, la variación y lo que requiere atención', () => {
    const getResumen = jasmine.createSpy().and.returnValue(of(resumen));
    TestBed.configureTestingModule({ imports: [AdmDashboardComponent], providers: [provideRouter([]), { provide: ResumenGerencialService, useValue: { getResumen } }] });
    const f = TestBed.createComponent(AdmDashboardComponent);
    f.detectChanges();
    expect(getResumen).toHaveBeenCalledWith(f.componentInstance.mes);
    const texto = (f.nativeElement as HTMLElement).textContent!.replace(/\s+/g, ' ');
    const kpis = Array.from((f.nativeElement as HTMLElement).querySelectorAll('.kpi')).map(e => e.textContent!.trim());
    expect(kpis).toEqual(['10', '$1,200', '$9,000', '2']);  // activos, gasto del mes, gasto del año, requieren atención
    expect(texto).toContain('3 en taller · 1 en salida');
    expect(texto).toContain('+20 % vs. mes anterior');     // 1200 frente a 1000
    expect(texto).toContain('trabajo repetido');
    expect(texto).toContain('2 vencidas');
    expect(texto).toContain('95 %');                       // contrato casi agotado
  });
});
