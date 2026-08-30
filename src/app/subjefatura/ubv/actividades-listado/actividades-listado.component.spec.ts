import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesListadoComponent } from './actividades-listado.component';

describe('ActividadesListadoComponent', () => {
  let component: ActividadesListadoComponent;
  let fixture: ComponentFixture<ActividadesListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
