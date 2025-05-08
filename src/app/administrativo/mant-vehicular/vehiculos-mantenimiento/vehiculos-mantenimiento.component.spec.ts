import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosMantenimientoComponent } from './vehiculos-mantenimiento.component';

describe('VehiculosMantenimientoComponent', () => {
  let component: VehiculosMantenimientoComponent;
  let fixture: ComponentFixture<VehiculosMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculosMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
