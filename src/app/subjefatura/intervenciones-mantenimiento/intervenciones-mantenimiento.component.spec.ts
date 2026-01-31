import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervencionesMantenimientoComponent } from './intervenciones-mantenimiento.component';

describe('IntervencionesMantenimientoComponent', () => {
  let component: IntervencionesMantenimientoComponent;
  let fixture: ComponentFixture<IntervencionesMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervencionesMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervencionesMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
