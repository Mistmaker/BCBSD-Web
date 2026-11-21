import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { OrdenesAbastecimientoMantenimientoComponent } from './ordenes-abastecimiento-mantenimiento.component';

describe('OrdenesAbastecimientoMantenimientoComponent', () => {
  let component: OrdenesAbastecimientoMantenimientoComponent;
  let fixture: ComponentFixture<OrdenesAbastecimientoMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesAbastecimientoMantenimientoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesAbastecimientoMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
