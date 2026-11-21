import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { OrdenMovilizacionMantenimientoComponent } from './orden-movilizacion-mantenimiento.component';

describe('OrdenMovilizacionMantenimientoComponent', () => {
  let component: OrdenMovilizacionMantenimientoComponent;
  let fixture: ComponentFixture<OrdenMovilizacionMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenMovilizacionMantenimientoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
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
