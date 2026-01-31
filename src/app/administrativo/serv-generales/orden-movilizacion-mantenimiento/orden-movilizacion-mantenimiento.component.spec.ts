import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenMovilizacionMantenimientoComponent } from './orden-movilizacion-mantenimiento.component';

describe('OrdenMovilizacionMantenimientoComponent', () => {
  let component: OrdenMovilizacionMantenimientoComponent;
  let fixture: ComponentFixture<OrdenMovilizacionMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenMovilizacionMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenMovilizacionMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
