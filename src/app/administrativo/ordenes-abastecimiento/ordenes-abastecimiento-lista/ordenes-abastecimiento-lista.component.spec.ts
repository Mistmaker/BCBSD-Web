import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesAbastecimientoListaComponent } from './ordenes-abastecimiento-lista.component';

describe('OrdenesAbastecimientoListaComponent', () => {
  let component: OrdenesAbastecimientoListaComponent;
  let fixture: ComponentFixture<OrdenesAbastecimientoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesAbastecimientoListaComponent]
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
