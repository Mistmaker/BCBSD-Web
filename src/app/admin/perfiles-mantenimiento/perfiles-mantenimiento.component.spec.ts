import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesMantenimientoComponent } from './perfiles-mantenimiento.component';

describe('PerfilesMantenimientoComponent', () => {
  let component: PerfilesMantenimientoComponent;
  let fixture: ComponentFixture<PerfilesMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilesMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilesMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
