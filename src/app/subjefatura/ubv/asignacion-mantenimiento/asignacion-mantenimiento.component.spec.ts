import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AsignacionMantenimientoComponent } from './asignacion-mantenimiento.component';

describe('AsignacionMantenimientoComponent', () => {
  let component: AsignacionMantenimientoComponent;
  let fixture: ComponentFixture<AsignacionMantenimientoComponent>;

  beforeEach(async () => {
    // El componente lee la sesión del usuario logueado desde localStorage.
    localStorage.setItem('usuario', JSON.stringify({ usuario: { usuario_id: 1, voluntario_id: null, roles: [] } }));

    await TestBed.configureTestingModule({
      imports: [AsignacionMantenimientoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('usuario'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
