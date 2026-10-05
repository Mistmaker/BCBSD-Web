import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesAbastecimientoMantenimientoComponent } from './ordenes-abastecimiento-mantenimiento.component';

describe('OrdenesAbastecimientoMantenimientoComponent', () => {
  let component: OrdenesAbastecimientoMantenimientoComponent;
  let fixture: ComponentFixture<OrdenesAbastecimientoMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesAbastecimientoMantenimientoComponent]
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
