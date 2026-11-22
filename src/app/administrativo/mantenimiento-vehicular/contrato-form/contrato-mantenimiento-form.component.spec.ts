import { AuthService } from '../../../auth/auth.service';
import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { ContratoMantenimientoFormComponent } from './contrato-mantenimiento-form.component';
import { porcentajeUsado } from '../contratos-lista/contratos-mantenimiento-lista.component';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { PersonalService } from '../../../tthh/services/personal.service';
import { ContratoMantenimientoModel } from '../../models/mantenimiento.model';

describe('ContratoMantenimientoFormComponent', () => {
  let mant: jasmine.SpyObj<MantenimientoService>;

  function crear(id: string) {
    TestBed.configureTestingModule({
      imports: [ContratoMantenimientoFormComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { tienePermiso: () => true, getUsuario: () => ({}) } },
        { provide: MantenimientoService, useValue: mant },
        { provide: PersonalService, useValue: { getAll: () => of([]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
      ]
    });
    const f = TestBed.createComponent(ContratoMantenimientoFormComponent);
    f.detectChanges();
    return f.componentInstance;
  }

  beforeEach(() => {
    mant = jasmine.createSpyObj<MantenimientoService>('MantenimientoService', ['getEstadoVehiculos', 'getConfiguracion', 'getContrato', 'guardarContrato']);
    mant.getEstadoVehiculos.and.returnValue(of([]));
    mant.getConfiguracion.and.returnValue(of({ sistema_nombre: '', sistema_siglas: 'CBSD', director_administrativo: null, parametros: [] }));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
  });

  it('contrato nuevo: una partida por rubro y reparto del monto', () => {
    const c = crear('nuevo');
    expect(c.contrato.partidas.map(p => p.partida_rubro)).toEqual(['MANO DE OBRA', 'REPUESTOS', 'ACEITES Y LUBRICANTES']);
    c.contrato.contrato_monto = 200000;
    c.repartir();
    expect(c.totalPartidas).toBe(200000);
    expect(c.sinAsignar).toBe(0);
  });

  it('no guarda si las partidas superan el monto', () => {
    const c = crear('nuevo');
    c.contrato.contrato_monto = 100;
    c.contrato.partidas[0].partida_monto = 150;
    c.guardar({ invalid: false } as any);
    expect(mant.guardarContrato).not.toHaveBeenCalled();
  });

  it('no permite quitar una partida con consumos', () => {
    mant.getContrato.and.returnValue(of(Object.assign(new ContratoMantenimientoModel(), {
      contrato_id: 1, contrato_monto: '1000', vehiculos: [],
      partidas: [{ partida_id: 5, partida_rubro: 'REPUESTOS', asignado: '600', consumido: '120', saldo: '480' }],
    })));
    const c = crear('1');
    expect(c.contrato.partidas[0].partida_monto).toBe(600);
    c.quitarPartida(0);
    expect(c.contrato.partidas.length).toBe(1);
  });

  it('porcentaje usado', () => {
    expect(porcentajeUsado(200, 50)).toBe(25);
    expect(porcentajeUsado(0, 50)).toBe(0);
    expect(porcentajeUsado('100', '150')).toBe(100);
  });
});
