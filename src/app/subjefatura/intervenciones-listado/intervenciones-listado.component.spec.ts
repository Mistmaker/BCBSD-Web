import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { IntervencionesListadoComponent } from './intervenciones-listado.component';

describe('IntervencionesListadoComponent', () => {
  let component: IntervencionesListadoComponent;
  let fixture: ComponentFixture<IntervencionesListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervencionesListadoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervencionesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
