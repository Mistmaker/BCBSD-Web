import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { EstacionesMantenimientoComponent } from './estaciones-mantenimiento.component';
import { EstacionesService } from '../services/estaciones.service';

describe('EstacionesMantenimientoComponent', () => {
  let component: EstacionesMantenimientoComponent;
  let fixture: ComponentFixture<EstacionesMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstacionesMantenimientoComponent],
      providers: [
        {
          provide: EstacionesService,
          useValue: {
            getJornadas: jasmine.createSpy().and.returnValue(of([])),
            getById: jasmine.createSpy().and.returnValue(of({})),
            save: jasmine.createSpy().and.returnValue(of({ msg: 'Guardado' })),
            update: jasmine.createSpy().and.returnValue(of({ msg: 'Actualizado' }))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'nuevo' }) } }
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstacionesMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
