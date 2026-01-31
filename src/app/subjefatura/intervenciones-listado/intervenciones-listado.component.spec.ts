import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervencionesListadoComponent } from './intervenciones-listado.component';

describe('IntervencionesListadoComponent', () => {
  let component: IntervencionesListadoComponent;
  let fixture: ComponentFixture<IntervencionesListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervencionesListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervencionesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
