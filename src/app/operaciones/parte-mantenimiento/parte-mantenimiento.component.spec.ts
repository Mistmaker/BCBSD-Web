import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParteMantenimientoComponent } from './parte-mantenimiento.component';

describe('ParteMantenimientoComponent', () => {
  let component: ParteMantenimientoComponent;
  let fixture: ComponentFixture<ParteMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParteMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParteMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
