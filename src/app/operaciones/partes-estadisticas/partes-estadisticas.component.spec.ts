import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { EstadisticasPartes } from '../models/partes-estadisticas.model';
import { ParteService } from '../services/parte.service';
import { PdfService } from '../../core/pdf.service';
import { graficosInformePartes, PartesEstadisticasComponent } from './partes-estadisticas.component';

describe('PartesEstadisticasComponent', () => {
  const datos: EstadisticasPartes = {
    desde: '2026-01-01', hasta: '2026-11-22',
    resumen: { partes: 12, auxilio: 9, incendio: 3, victimas: 4, fallecidos: 1, personas_asistidas: 6, respuesta_prom_min: 14.5, respuesta_mediana_min: 12,
      horas_operacion: 20.5, km: 340 },
    por_mes: [{ mes: '2026-10', auxilio: 4, incendio: 1 }, { mes: '2026-11', auxilio: 5, incendio: 2 }],
    por_estacion: [{ estacion_id: 1, estacion: 'X-1', partes: 12, auxilio: 9, incendio: 3, respuesta_prom_min: 14.5, salidas_vehiculos: 15, participaciones: 40 }],
    por_vehiculo: [{ vehiculo_id: 7, siglas: 'R-11', placa: 'PMA-8597', externo: false, salidas: 10, km: 300, horas: 15, respuesta_prom_min: 13, ultima: '2026-11-20' }],
    por_bombero: [{ personal_id: 5, nombre: 'RAMIREZ MIGUEL', rango: 'Bro. V.', participaciones: 8, al_mando: 6, aph: 0, operativo: 2, horas: 12, ultima: '2026-11-20' }],
    por_recurso: [{ tipo: 'EQUIPO', recurso_id: 1, descripcion: 'MOTOSIERRA', partes: 5, cantidad: 5 }, { tipo: 'INSUMO', recurso_id: 2, descripcion: 'GASAS', partes: 2, cantidad: 20 }],
    por_tipo_auxilio: [{ clasificacion: 'Auxilio', subclasificacion: 'Tala de árboles', partes: 5 }],
    por_causa: [{ clasificacion: 'Auxilio', descripcion: 'Desastre natural', partes: 3 }],
    por_dia_semana: [1, 2, 3, 0, 2, 2, 2],
    por_hora: Array(24).fill(0).map((_, h) => h === 22 ? 5 : 0),
  };

  it('muestra cifras, tablas por estación, vehículo, bombero y herramientas', () => {
    const getEstadisticas = jasmine.createSpy().and.returnValue(of(datos));
    TestBed.configureTestingModule({
      imports: [PartesEstadisticasComponent],
      providers: [provideRouter([]),
        { provide: ParteService, useValue: { getEstadisticas, getCatalogos: () => of({ estaciones: [] }) } },
        { provide: PdfService, useValue: {} },
        { provide: AuthService, useValue: { tienePermiso: () => true } }],
    });
    const f = TestBed.createComponent(PartesEstadisticasComponent);
    f.detectChanges();
    expect(getEstadisticas).toHaveBeenCalled();
    const el = f.nativeElement as HTMLElement;
    const kpis = Array.from(el.querySelectorAll('.kpi')).map(e => e.textContent!.trim());
    expect(kpis).toEqual(['12', '15 min', '4 / 1', '340 km', '20.5 h', '1']);
    const c = f.componentInstance;
    c.vista['vehiculo'] = 'tabla';
    c.vista['bombero'] = 'tabla';
    c.vista['recurso'] = 'tabla';
    f.detectChanges();
    const texto = el.textContent!.replace(/\s+/g, ' ');
    expect(texto).toContain('X-1');
    expect(texto).toContain('R-11 · PMA-8597');
    expect(el.querySelector('a[href="/admin/bitacora-vehiculos/7"]')).not.toBeNull();
    expect(texto).toContain('RAMIREZ MIGUEL');
    expect(texto).toContain('MOTOSIERRA');
    expect(texto).not.toContain('GASAS');
    c.elegirTipoRecurso('INSUMO');
    f.detectChanges();
    expect(el.textContent).toContain('GASAS');
  });

  it('gráficos del informe: uno por sección; recursos solo con equipos', () => {
    const g = graficosInformePartes(datos);
    expect(Object.keys(g)).toEqual(['mes', 'vehiculo', 'bombero', 'recurso', 'auxilio', 'hora']);
    Object.values(g).forEach(png => expect(png).toMatch(/^data:image\/png;base64,/));
    expect(graficosInformePartes({ ...datos, por_recurso: [datos.por_recurso[1]] })['recurso']).toBeNull();
  });

  it('imprime con el filtro de la última consulta', async () => {
    const abrirPost = jasmine.createSpy().and.returnValue(Promise.resolve());
    TestBed.configureTestingModule({
      imports: [PartesEstadisticasComponent],
      providers: [provideRouter([]),
        { provide: ParteService, useValue: { getEstadisticas: () => of(datos), getCatalogos: () => of({ estaciones: [] }), urlInformeEstadistico: () => 'u' } },
        { provide: PdfService, useValue: { abrirPost } },
        { provide: AuthService, useValue: { tienePermiso: () => true } }],
    });
    const f = TestBed.createComponent(PartesEstadisticasComponent);
    f.detectChanges();
    const c = f.componentInstance;
    const desde = c.filtro.desde;
    c.filtro.desde = '2020-01-01'; // cambiado sin volver a consultar
    (f.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button[title^="Informe"]')!.click();
    const [url, cuerpo] = abrirPost.calls.mostRecent().args;
    expect(url).toBe('u');
    expect(cuerpo.desde).toBe(desde);
    expect(Object.keys(cuerpo.graficos).length).toBe(6);
    await Promise.resolve();
    expect(c.imprimiendo).toBeFalse();
  });
});
