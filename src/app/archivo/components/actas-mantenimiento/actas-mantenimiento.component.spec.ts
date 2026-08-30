import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActasMantenimientoComponent } from './actas-mantenimiento.component';

describe('ActasMantenimientoComponent', () => {
  let component: ActasMantenimientoComponent;
  let fixture: ComponentFixture<ActasMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActasMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActasMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
