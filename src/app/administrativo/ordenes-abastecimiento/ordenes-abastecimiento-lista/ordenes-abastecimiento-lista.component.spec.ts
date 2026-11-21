import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { OrdenesAbastecimientoListaComponent } from './ordenes-abastecimiento-lista.component';

describe('OrdenesAbastecimientoListaComponent', () => {
  let component: OrdenesAbastecimientoListaComponent;
  let fixture: ComponentFixture<OrdenesAbastecimientoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesAbastecimientoListaComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesAbastecimientoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
