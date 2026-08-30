import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposMantenimientoComponent } from './tipos-mantenimiento.component';

describe('TiposMantenimientoComponent', () => {
  let component: TiposMantenimientoComponent;
  let fixture: ComponentFixture<TiposMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
