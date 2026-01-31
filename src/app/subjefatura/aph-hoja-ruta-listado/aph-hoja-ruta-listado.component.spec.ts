import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AphHojaRutaListadoComponent } from './aph-hoja-ruta-listado.component';

describe('AphHojaRutaListadoComponent', () => {
  let component: AphHojaRutaListadoComponent;
  let fixture: ComponentFixture<AphHojaRutaListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AphHojaRutaListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AphHojaRutaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
