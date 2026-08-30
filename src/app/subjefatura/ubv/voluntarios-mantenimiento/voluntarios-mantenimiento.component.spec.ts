import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntariosMantenimientoComponent } from './voluntarios-mantenimiento.component';

describe('VoluntariosMantenimientoComponent', () => {
  let component: VoluntariosMantenimientoComponent;
  let fixture: ComponentFixture<VoluntariosMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoluntariosMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoluntariosMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
