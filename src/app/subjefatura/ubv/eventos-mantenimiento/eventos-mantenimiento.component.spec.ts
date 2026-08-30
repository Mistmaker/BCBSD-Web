import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosMantenimientoComponent } from './eventos-mantenimiento.component';

describe('EventosMantenimientoComponent', () => {
  let component: EventosMantenimientoComponent;
  let fixture: ComponentFixture<EventosMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
