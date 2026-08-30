import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosListadoComponent } from './eventos-listado.component';

describe('EventosListadoComponent', () => {
  let component: EventosListadoComponent;
  let fixture: ComponentFixture<EventosListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
