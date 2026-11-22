import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { PdfService } from '../../core/pdf.service';
import { ParteService } from '../services/parte.service';
import { ParteListadoComponent } from './parte-listado.component';

describe('ParteListadoComponent', () => {
  const partes = [{
    parte_id: 3, parte_numero: 'CBSD-PA-X1-2026-0003', parte_tipo: 'AUXILIO', parte_estado: 'REGISTRADO', parte_fecha: '2026-11-20', parte_hora_aviso: '22:05',
    fk_estacion_id: 1, estacion_nombre: 'X-1', parte_direccion: 'Av. Quito', tipos_auxilio: 'Auxilio / Evacuación', vehiculos: 'R-11', al_mando: 'RAMIREZ MIGUEL',
    parte_total_heridos: 1, parte_total_muertos: 0,
  }];

  function crear(permisos: string[]) {
    const getAll = jasmine.createSpy().and.returnValue(of(partes));
    const abrir = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [ParteListadoComponent],
      providers: [provideRouter([]),
        { provide: PdfService, useValue: { abrir } },
        { provide: ParteService, useValue: { getAll, urlPdf: (id: number) => `pdf/${id}`, getCatalogos: () => of({ estaciones: [{ estacion_id: 1, estacion_nombre: 'X-1' }] }) } },
        { provide: AuthService, useValue: { tienePermiso: (c: string) => permisos.includes(c) } }],
    });
    const f = TestBed.createComponent(ParteListadoComponent);
    f.detectChanges();
    return { f, getAll, abrir, el: f.nativeElement as HTMLElement };
  }

  it('lista los partes del año con número, clasificación y vehículos', () => {
    const { f, getAll, el } = crear(['OPE_PARTES', 'OPE_PARTE_REGISTRAR', 'OPE_PARTES_ESTADISTICAS']);
    expect(getAll).toHaveBeenCalledWith(jasmine.objectContaining({ desde: `${new Date().getFullYear()}-01-01` }));
    const texto = el.textContent!.replace(/\s+/g, ' ');
    expect(texto).toContain('CBSD-PA-X1-2026-0003');
    expect(texto).toContain('Auxilio / Evacuación');
    expect(texto).toContain('R-11');
    expect(texto).toContain('Nuevo parte');
    expect(texto).toContain('Estadística');
    expect(el.querySelector('[aria-label="Editar CBSD-PA-X1-2026-0003"]')).not.toBeNull();
    f.componentInstance.filtro.estacion = 1;
    f.componentInstance.cargarDatos();
    expect(getAll).toHaveBeenCalledWith(jasmine.objectContaining({ estacion: 1 }));
  });

  it('sin privilegio de registro: solo consulta, pero puede imprimir', () => {
    const { el, abrir } = crear(['OPE_PARTES']);
    (el.querySelector('[aria-label="Imprimir CBSD-PA-X1-2026-0003"]') as HTMLButtonElement).click();
    expect(abrir).toHaveBeenCalledWith('pdf/3');
    const texto = el.textContent!;
    expect(texto).not.toContain('Nuevo parte');
    expect(texto).not.toContain('Estadística');
    expect(el.querySelector('[aria-label="Ver CBSD-PA-X1-2026-0003"]')).not.toBeNull();
  });
});
