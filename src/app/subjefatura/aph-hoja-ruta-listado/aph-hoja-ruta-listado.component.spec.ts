import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AphHojaRutaListadoComponent } from './aph-hoja-ruta-listado.component';

describe('AphHojaRutaListadoComponent', () => {
  let component: AphHojaRutaListadoComponent;
  let fixture: ComponentFixture<AphHojaRutaListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AphHojaRutaListadoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
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
