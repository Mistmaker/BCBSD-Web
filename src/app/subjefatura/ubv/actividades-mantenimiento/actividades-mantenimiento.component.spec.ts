import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesMantenimientoComponent } from './actividades-mantenimiento.component';

describe('ActividadesMantenimientoComponent', () => {
  let component: ActividadesMantenimientoComponent;
  let fixture: ComponentFixture<ActividadesMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
