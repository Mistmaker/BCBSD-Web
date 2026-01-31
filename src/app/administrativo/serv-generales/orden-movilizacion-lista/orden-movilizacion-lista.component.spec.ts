import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenMovilizacionListaComponent } from './orden-movilizacion-lista.component';

describe('OrdenMovilizacionListaComponent', () => {
  let component: OrdenMovilizacionListaComponent;
  let fixture: ComponentFixture<OrdenMovilizacionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenMovilizacionListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenMovilizacionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
