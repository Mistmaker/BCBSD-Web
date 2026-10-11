import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionesMantenimientoComponent } from './estaciones-mantenimiento.component';

describe('EstacionesMantenimientoComponent', () => {
  let component: EstacionesMantenimientoComponent;
  let fixture: ComponentFixture<EstacionesMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstacionesMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstacionesMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
