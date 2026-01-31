import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AphHojaRutaMantenimientoComponent } from './aph-hoja-ruta-mantenimiento.component';

describe('AphHojaRutaMantenimientoComponent', () => {
  let component: AphHojaRutaMantenimientoComponent;
  let fixture: ComponentFixture<AphHojaRutaMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AphHojaRutaMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AphHojaRutaMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
