import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { DistributivoListadoComponent } from './distributivo-listado.component';

describe('DistributivoListadoComponent', () => {
  let component: DistributivoListadoComponent;
  let fixture: ComponentFixture<DistributivoListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributivoListadoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributivoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
