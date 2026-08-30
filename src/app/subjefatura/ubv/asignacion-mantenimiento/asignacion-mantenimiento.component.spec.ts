import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionMantenimientoComponent } from './asignacion-mantenimiento.component';

describe('AsignacionMantenimientoComponent', () => {
  let component: AsignacionMantenimientoComponent;
  let fixture: ComponentFixture<AsignacionMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
