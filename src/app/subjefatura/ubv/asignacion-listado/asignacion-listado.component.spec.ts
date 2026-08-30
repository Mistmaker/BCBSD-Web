import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionListadoComponent } from './asignacion-listado.component';

describe('AsignacionListadoComponent', () => {
  let component: AsignacionListadoComponent;
  let fixture: ComponentFixture<AsignacionListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
