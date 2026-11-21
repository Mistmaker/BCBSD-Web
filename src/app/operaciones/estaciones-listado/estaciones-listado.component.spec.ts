import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { EstacionesListadoComponent } from './estaciones-listado.component';

describe('EstacionesListadoComponent', () => {
  let component: EstacionesListadoComponent;
  let fixture: ComponentFixture<EstacionesListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstacionesListadoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstacionesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
