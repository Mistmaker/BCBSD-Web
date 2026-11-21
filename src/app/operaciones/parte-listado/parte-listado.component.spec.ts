import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ParteListadoComponent } from './parte-listado.component';

describe('ParteListadoComponent', () => {
  let component: ParteListadoComponent;
  let fixture: ComponentFixture<ParteListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParteListadoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParteListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
