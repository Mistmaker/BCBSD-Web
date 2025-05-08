import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosListadoComponent } from './vehiculos-listado.component';

describe('VehiculosListadoComponent', () => {
  let component: VehiculosListadoComponent;
  let fixture: ComponentFixture<VehiculosListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
