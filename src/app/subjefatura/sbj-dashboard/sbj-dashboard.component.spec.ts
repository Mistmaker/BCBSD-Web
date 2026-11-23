import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EmergenciasService } from '../services/emergencias.service';
import { ParteService } from '../../operaciones/services/parte.service';
import { EstadisticasEmergencias, SeccionEmergencias } from '../models/emergencias.model';
import { SbjDashboardComponent } from './sbj-dashboard.component';

describe('SbjDashboardComponent', () => {
  const vacia = (): SeccionEmergencias => ({ resumen: { partes: 0, victimas: 0, fallecidos: 0, respuesta_prom_min: null }, por_parroquia: [], por_sector: [],
    causas: [], por_dia_semana: [0, 0, 0, 0, 0, 0, 0], por_hora: Array(24).fill(0) });
  const datos: EstadisticasEmergencias = {
    desde: '2026-01-01', hasta: '2026-11-23',
    resumen: { partes: 9, incendio: 4, auxilio: 5, victimas: 3, fallecidos: 1, respuesta_prom_min: 12 },
    por_mes: [{ mes: '2026-10', incendio: 1, auxilio: 2 }, { mes: '2026-11', incendio: 3, auxilio: 3 }],
    incendio: { ...vacia(), resumen: { partes: 4, victimas: 1, fallecidos: 1, respuesta_prom_min: 15, area_destruida_m2: 120, superficie_quemada_m2: 0,
      causante_identificado: 1, causante_no_identificado: 2 }, tipos_incendio: [{ nombre: 'Forestal', detalle: null, partes: 3 }],
      naturalezas: [{ nombre: 'Vivienda', detalle: null, partes: 2 }], por_hora: Array(24).fill(0).map((_, h) => h === 14 ? 3 : 0) },
    auxilio: { ...vacia(), resumen: { partes: 5, victimas: 2, fallecidos: 0, respuesta_prom_min: 10 },
      clasificaciones: [{ nombre: 'Auxilio', detalle: null, partes: 4 }], subclasificaciones: [{ nombre: 'Auxilio / Tala de árboles', detalle: 'Tala', partes: 3 }] },
    puntos: [],
  };

  it('muestra las cifras y cambia entre incendio y auxilio', () => {
    TestBed.configureTestingModule({
      imports: [SbjDashboardComponent],
      providers: [{ provide: EmergenciasService, useValue: { getEstadisticas: () => of(datos) } },
        { provide: ParteService, useValue: { getCatalogos: () => of({ estaciones: [] }) } }],
    });
    const f = TestBed.createComponent(SbjDashboardComponent);
    f.detectChanges();
    const el = f.nativeElement as HTMLElement;
    const c = f.componentInstance;
    c.verTabla = true;
    f.detectChanges();
    let texto = el.textContent!.replace(/\s+/g, ' ');
    expect(texto).toContain('4 incendio · 5 auxilio');
    expect(texto).toContain('120 m²');
    expect(texto).toContain('Forestal');
    expect(texto).toContain('Hora: 14:00 – 14:59');
    c.elegir('AUXILIO');
    f.detectChanges();
    texto = el.textContent!.replace(/\s+/g, ' ');
    expect(texto).toContain('Auxilio / Tala de árboles (Tala)');
    expect(texto).not.toContain('Área destruida');
  });
});
