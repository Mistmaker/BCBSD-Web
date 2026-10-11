import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionesListadoComponent } from './estaciones-listado.component';

describe('EstacionesListadoComponent', () => {
  let component: EstacionesListadoComponent;
  let fixture: ComponentFixture<EstacionesListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstacionesListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstacionesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
