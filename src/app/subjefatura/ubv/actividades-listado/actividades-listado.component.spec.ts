import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ActividadesListadoComponent } from './actividades-listado.component';

describe('ActividadesListadoComponent', () => {
  let component: ActividadesListadoComponent;
  let fixture: ComponentFixture<ActividadesListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesListadoComponent],
      providers: [provideNoopAnimations(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
